import { Matcher, MatcherOptions, fireEvent, waitFor, within } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import { cloneDeep } from 'lodash';
import React from 'react';
import Vi from 'vitest';

import fakeAddress from '__mocks__/models/address';
import proposals from '__mocks__/models/proposals';
import voters from '__mocks__/models/voters';
import {
  cancelProposal,
  executeProposal,
  getCurrentVotes,
  getProposal,
  getProposalThreshold,
  getVoteReceipt,
  queueProposal,
  useGetVoters,
} from 'clients/api';
import CREATE_PROPOSAL_THRESHOLD_WEI from 'constants/createProposalThresholdWei';
import useVote from 'hooks/useVote';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import Proposal from '.';
import PROPOSAL_SUMMARY_TEST_IDS from './ProposalSummary/testIds';
import VOTE_MODAL_TEST_IDS from './VoteModal/testIds';
import TEST_IDS from './testIds';

vi.mock('hooks/useVote');

const incorrectAction = proposals[0];
const activeProposal = proposals[1];
const cancelledProposal = proposals[3];
const succeededProposal = proposals[4];
const queuedProposal = proposals[5];

const checkAllButtons = async (
  getByTestId: (id: Matcher, options?: MatcherOptions | undefined) => HTMLElement,
  check: (element: HTMLElement) => void,
) => {
  const voteForButton = await waitFor(async () =>
    within(getByTestId(TEST_IDS.voteSummary.for)).getByRole('button'),
  );
  const voteAgainstButton = await waitFor(async () =>
    within(getByTestId(TEST_IDS.voteSummary.against)).getByRole('button'),
  );
  const voteAbstainButton = await waitFor(async () =>
    within(getByTestId(TEST_IDS.voteSummary.abstain)).getByRole('button'),
  );

  check(voteForButton);
  check(voteAgainstButton);
  check(voteAbstainButton);
};

describe('pages/Proposal', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(
      activeProposal.endDate!.setMinutes(activeProposal.endDate!.getMinutes() - 5),
    );

    (getVoteReceipt as Vi.Mock).mockImplementation(() => ({
      voteSupport: 'NOT_VOTED',
    }));
    (getProposal as Vi.Mock).mockImplementation(() => activeProposal);

    (getProposalThreshold as Vi.Mock).mockImplementation(() => ({
      thresholdWei: CREATE_PROPOSAL_THRESHOLD_WEI,
    }));

    (useVote as Vi.Mock).mockImplementation(() => ({
      vote: vi.fn(),
      isLoading: false,
    }));

    (getCurrentVotes as Vi.Mock).mockImplementation(() => ({
      votesWei: new BigNumber('100000000000000000'),
    }));
  });

  it('renders without crashing', async () => {
    renderComponent(<Proposal />);
  });

  it('renders without crashing on', async () => {
    (getProposal as Vi.Mock).mockImplementation(() => incorrectAction);
    renderComponent(<Proposal />);
  });

  it('vote buttons are disabled when wallet is not connected', async () => {
    const { getByTestId } = renderComponent(<Proposal />);
    await checkAllButtons(getByTestId, (element: HTMLElement) => expect(element).toBeDisabled());
  });

  it('vote buttons are disabled when proposal is not active', async () => {
    (getProposal as Vi.Mock).mockImplementationOnce(() => cancelledProposal);
    const { getByTestId } = renderComponent(<Proposal />, {
      authContextValue: {
        accountAddress: fakeAddress,
      },
    });
    await checkAllButtons(getByTestId, (element: HTMLElement) => expect(element).toBeDisabled());
  });

  it('vote buttons are disabled when vote is cast', async () => {
    (getVoteReceipt as Vi.Mock).mockImplementation(() => ({
      voteSupport: 'FOR',
    }));

    const { getByTestId } = renderComponent(<Proposal />, {
      authContextValue: {
        accountAddress: fakeAddress,
      },
    });

    await checkAllButtons(getByTestId, (element: HTMLElement) => expect(element).toBeDisabled());
  });

  it('vote buttons are disabled when voting weight is 0', async () => {
    (getCurrentVotes as Vi.Mock).mockImplementation(() => ({ votesWei: new BigNumber(0) }));

    const { getByTestId } = renderComponent(<Proposal />, {
      authContextValue: {
        accountAddress: fakeAddress,
      },
    });

    await checkAllButtons(getByTestId, (element: HTMLElement) => expect(element).toBeDisabled());
  });

  it('vote buttons are enabled when requirements are met', async () => {
    const { getByTestId } = renderComponent(<Proposal />, {
      authContextValue: {
        accountAddress: fakeAddress,
      },
    });

    await checkAllButtons(getByTestId, (element: HTMLElement) => expect(element).toBeEnabled());
  });

  it('allows user to vote for', async () => {
    const vote = vi.fn();
    (useVote as Vi.Mock).mockImplementation(() => ({
      vote,
      isLoading: false,
    }));
    const { getByTestId, getByLabelText } = renderComponent(<Proposal />, {
      authContextValue: {
        accountAddress: fakeAddress,
      },
    });

    const voteButton = await waitFor(async () =>
      within(getByTestId(TEST_IDS.voteSummary.for)).getByRole('button'),
    );
    fireEvent.click(voteButton);

    const votingPower = await waitFor(async () => getByLabelText(en.vote.votingPower));
    expect(votingPower).toHaveValue('0.10');

    const castButton = await waitFor(async () => getByTestId(VOTE_MODAL_TEST_IDS.submitButton));
    expect(castButton).toBeEnabled();
    fireEvent.click(castButton);
    await waitFor(() =>
      expect(vote).toBeCalledWith({ proposalId: 97, voteReason: '', voteType: 1 }),
    );
  });

  it('allows user to vote against with reason', async () => {
    const vote = vi.fn();
    (useVote as Vi.Mock).mockImplementation(() => ({
      vote,
      isLoading: false,
    }));

    const comment = 'Not a good idea';
    const { getByTestId, getByLabelText } = renderComponent(<Proposal />, {
      authContextValue: {
        accountAddress: fakeAddress,
      },
    });

    const voteButton = await waitFor(async () =>
      within(getByTestId(TEST_IDS.voteSummary.against)).getByRole('button'),
    );
    fireEvent.click(voteButton);

    const votingPower = await waitFor(async () => getByLabelText(en.vote.votingPower));
    expect(votingPower).toHaveValue('0.10');

    const commentInput = await waitFor(async () => getByLabelText(en.vote.comment));
    fireEvent.change(commentInput, { target: { value: comment } });

    const castButton = await waitFor(async () => getByTestId(VOTE_MODAL_TEST_IDS.submitButton));
    expect(castButton).toBeEnabled();
    fireEvent.click(castButton);

    await waitFor(() =>
      expect(vote).toBeCalledWith({ proposalId: 97, voteReason: comment, voteType: 0 }),
    );
  });

  it('allows user to vote abstain', async () => {
    const vote = vi.fn();
    (useVote as Vi.Mock).mockImplementation(() => ({
      vote,
      isLoading: false,
    }));

    const { getByTestId, getByLabelText } = renderComponent(<Proposal />, {
      authContextValue: {
        accountAddress: fakeAddress,
      },
    });

    const voteButton = await waitFor(async () =>
      within(getByTestId(TEST_IDS.voteSummary.abstain)).getByRole('button'),
    );
    fireEvent.click(voteButton);

    const votingPower = await waitFor(async () => getByLabelText(en.vote.votingPower));
    expect(votingPower).toHaveValue('0.10');

    const castButton = await waitFor(async () => getByTestId(VOTE_MODAL_TEST_IDS.submitButton));
    expect(castButton).toBeEnabled();
    fireEvent.click(castButton);
    await waitFor(() =>
      expect(vote).toBeCalledWith({ proposalId: 97, voteReason: '', voteType: 2 }),
    );
  });

  it('lists votes cast', async () => {
    (useGetVoters as Vi.Mock).mockImplementation(({ filter }: { filter: 0 | 1 | 2 }) => {
      const votersCopy = cloneDeep(voters);
      votersCopy.result = [votersCopy.result[filter]];
      return { data: votersCopy, isLoading: false };
    });
    const { getByTestId } = renderComponent(<Proposal />, {
      authContextValue: {
        accountAddress: fakeAddress,
      },
    });
    const againstVoteSummary = await waitFor(async () =>
      within(getByTestId(TEST_IDS.voteSummary.against)),
    );
    againstVoteSummary.getByText(voters.result[0].address);

    const forVoteSummary = await waitFor(async () => within(getByTestId(TEST_IDS.voteSummary.for)));
    forVoteSummary.getByText(voters.result[1].address);

    const abstainVoteSummary = await waitFor(async () =>
      within(getByTestId(TEST_IDS.voteSummary.abstain)),
    );
    abstainVoteSummary.getByText(voters.result[2].address);
  });

  it('proposer can always cancel their own proposal', async () => {
    (getCurrentVotes as Vi.Mock).mockImplementation(() => ({ votesWei: new BigNumber(0) }));
    const proposerAddress = activeProposal.proposer;
    const { getByTestId } = renderComponent(<Proposal />, {
      authContextValue: {
        accountAddress: proposerAddress,
      },
    });
    const cancelButton = await waitFor(async () =>
      getByTestId(PROPOSAL_SUMMARY_TEST_IDS.cancelButton),
    );

    fireEvent.click(cancelButton);
    await waitFor(() => expect(cancelButton).toBeEnabled());
    expect(cancelProposal).toBeCalledWith({ proposalId: 97 });
  });

  it('does not allow user to cancel if voting power of the proposer is greater than or equals threshold', async () => {
    (getCurrentVotes as Vi.Mock).mockImplementation(() => ({
      votesWei: new BigNumber(CREATE_PROPOSAL_THRESHOLD_WEI),
    }));
    const { getByTestId } = renderComponent(<Proposal />, {
      authContextValue: {
        accountAddress: fakeAddress,
      },
    });

    const cancelButton = await waitFor(async () =>
      getByTestId(PROPOSAL_SUMMARY_TEST_IDS.cancelButton),
    );

    await waitFor(() => expect(cancelButton).toBeDisabled());
  });

  it('user can cancel if voting power of the proposer dropped below threshold', async () => {
    (getCurrentVotes as Vi.Mock).mockImplementation(() => ({ votesWei: new BigNumber(0) }));
    const { getByTestId } = renderComponent(<Proposal />, {
      authContextValue: {
        accountAddress: fakeAddress,
      },
    });
    const cancelButton = await waitFor(async () =>
      getByTestId(PROPOSAL_SUMMARY_TEST_IDS.cancelButton),
    );

    fireEvent.click(cancelButton);

    await waitFor(() => expect(cancelButton).toBeEnabled());
    expect(cancelProposal).toBeCalledWith({ proposalId: 97 });
  });

  it('user can queue succeeded proposal', async () => {
    (getProposal as Vi.Mock).mockImplementationOnce(() => succeededProposal);
    const { getByTestId } = renderComponent(<Proposal />, {
      authContextValue: {
        accountAddress: fakeAddress,
      },
    });
    const queueButton = await waitFor(async () =>
      getByTestId(PROPOSAL_SUMMARY_TEST_IDS.queueButton),
    );
    fireEvent.click(queueButton);
    await waitFor(() => expect(queueProposal).toBeCalledWith({ proposalId: 95 }));
  });

  it('user can execute queued proposal', async () => {
    (getProposal as Vi.Mock).mockImplementationOnce(() => queuedProposal);
    const { getByTestId } = renderComponent(<Proposal />, {
      authContextValue: {
        accountAddress: fakeAddress,
      },
    });
    const executeButton = await waitFor(async () =>
      getByTestId(PROPOSAL_SUMMARY_TEST_IDS.executeButton),
    );
    fireEvent.click(executeButton);
    await waitFor(() => expect(executeProposal).toBeCalledWith({ proposalId: 98 }));
  });
});
