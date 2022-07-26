import { Matcher, MatcherOptions, fireEvent, waitFor, within } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import { cloneDeep } from 'lodash';
import React from 'react';
import { act } from 'react-dom/test-utils';

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

jest.mock('clients/api');
jest.mock('hooks/useVote');

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
    jest
      .useFakeTimers('modern')
      .setSystemTime(activeProposal.endDate!.setMinutes(activeProposal.endDate!.getMinutes() - 5));

    (getVoteReceipt as jest.Mock).mockImplementation(() => ({
      voteSupport: 'NOT_VOTED',
    }));
    (getProposal as jest.Mock).mockImplementation(() => activeProposal);

    (getProposalThreshold as jest.Mock).mockImplementation(() => ({
      thresholdWei: CREATE_PROPOSAL_THRESHOLD_WEI,
    }));

    (useVote as jest.Mock).mockImplementation(() => ({
      vote: jest.fn(),
      isLoading: false,
    }));

    (getCurrentVotes as jest.Mock).mockImplementation(() => ({
      votesWei: new BigNumber('100000000000000000'),
    }));
  });

  it('renders without crashing', async () => {
    renderComponent(<Proposal />);
  });

  it('renders without crashing on', async () => {
    (getProposal as jest.Mock).mockImplementation(() => incorrectAction);
    renderComponent(<Proposal />);
  });

  it('vote buttons are disabled when wallet is not connected', async () => {
    const { getByTestId } = renderComponent(<Proposal />);
    await checkAllButtons(getByTestId, (element: HTMLElement) => expect(element).toBeDisabled());
  });

  it('vote buttons are disabled when proposal is not active', async () => {
    (getProposal as jest.Mock).mockImplementationOnce(() => cancelledProposal);
    const { getByTestId } = renderComponent(<Proposal />, {
      authContextValue: {
        account: {
          address: fakeAddress,
        },
      },
    });
    await checkAllButtons(getByTestId, (element: HTMLElement) => expect(element).toBeDisabled());
  });

  it('vote buttons are disabled when vote is cast', async () => {
    (getVoteReceipt as jest.Mock).mockImplementation(() => ({
      voteSupport: 'FOR',
    }));

    const { getByTestId } = renderComponent(<Proposal />, {
      authContextValue: {
        account: {
          address: fakeAddress,
        },
      },
    });

    await checkAllButtons(getByTestId, (element: HTMLElement) => expect(element).toBeDisabled());
  });

  it('vote buttons are disabled when voting weight is 0', async () => {
    (getCurrentVotes as jest.Mock).mockImplementation(() => ({ votesWei: new BigNumber(0) }));

    const { getByTestId } = renderComponent(<Proposal />, {
      authContextValue: {
        account: {
          address: fakeAddress,
        },
      },
    });

    await checkAllButtons(getByTestId, (element: HTMLElement) => expect(element).toBeDisabled());
  });

  it('vote buttons are enabled when requirements are met', async () => {
    const { getByTestId } = renderComponent(<Proposal />, {
      authContextValue: {
        account: {
          address: fakeAddress,
        },
      },
    });

    await checkAllButtons(getByTestId, (element: HTMLElement) => expect(element).toBeEnabled());
  });

  it('allows user to vote for', async () => {
    const vote = jest.fn();
    (useVote as jest.Mock).mockImplementation(() => ({
      vote,
      isLoading: false,
    }));
    const { getByTestId, getByLabelText } = renderComponent(<Proposal />, {
      authContextValue: {
        account: {
          address: fakeAddress,
        },
      },
    });

    const voteButton = await waitFor(async () =>
      within(getByTestId(TEST_IDS.voteSummary.for)).getByRole('button'),
    );
    act(() => {
      fireEvent.click(voteButton);
    });

    const votingPower = await waitFor(async () => getByLabelText(en.vote.votingPower));
    expect(votingPower).toHaveValue('0.1');

    const castButton = await waitFor(async () => getByTestId(VOTE_MODAL_TEST_IDS.submitButton));
    expect(castButton).toBeEnabled();
    act(() => {
      fireEvent.click(castButton);
    });
    waitFor(() => expect(vote).toBeCalledWith({ proposalId: 97, voteReason: '', voteType: 1 }));
  });

  it('allows user to vote against with reason', async () => {
    const vote = jest.fn();
    (useVote as jest.Mock).mockImplementation(() => ({
      vote,
      isLoading: false,
    }));

    const comment = 'Not a good idea';
    const { getByTestId, getByLabelText } = renderComponent(<Proposal />, {
      authContextValue: {
        account: {
          address: fakeAddress,
        },
      },
    });

    const voteButton = await waitFor(async () =>
      within(getByTestId(TEST_IDS.voteSummary.against)).getByRole('button'),
    );
    act(() => {
      fireEvent.click(voteButton);
    });

    const votingPower = await waitFor(async () => getByLabelText(en.vote.votingPower));
    expect(votingPower).toHaveValue('0.1');

    const commentInput = await waitFor(async () => getByLabelText(en.vote.comment));
    fireEvent.change(commentInput, { target: { value: comment } });

    const castButton = await waitFor(async () => getByTestId(VOTE_MODAL_TEST_IDS.submitButton));
    expect(castButton).toBeEnabled();
    act(() => {
      fireEvent.click(castButton);
    });

    await waitFor(() =>
      expect(vote).toBeCalledWith({ proposalId: 97, voteReason: comment, voteType: 0 }),
    );
  });

  it('allows user to vote abstain', async () => {
    const vote = jest.fn();
    (useVote as jest.Mock).mockImplementation(() => ({
      vote,
      isLoading: false,
    }));

    const { getByTestId, getByLabelText } = renderComponent(<Proposal />, {
      authContextValue: {
        account: {
          address: fakeAddress,
        },
      },
    });

    const voteButton = await waitFor(async () =>
      within(getByTestId(TEST_IDS.voteSummary.abstain)).getByRole('button'),
    );
    act(() => {
      fireEvent.click(voteButton);
    });

    const votingPower = await waitFor(async () => getByLabelText(en.vote.votingPower));
    expect(votingPower).toHaveValue('0.1');

    const castButton = await waitFor(async () => getByTestId(VOTE_MODAL_TEST_IDS.submitButton));
    expect(castButton).toBeEnabled();
    act(() => {
      fireEvent.click(castButton);
    });
    await waitFor(() =>
      expect(vote).toBeCalledWith({ proposalId: 97, voteReason: '', voteType: 2 }),
    );
  });

  it('lists votes cast', async () => {
    (useGetVoters as jest.Mock).mockImplementation(({ filter }: { filter: 0 | 1 | 2 }) => {
      const votersCopy = cloneDeep(voters);
      votersCopy.result = [votersCopy.result[filter]];
      return { data: votersCopy, isLoading: false };
    });
    const { getByTestId } = renderComponent(<Proposal />, {
      authContextValue: {
        account: {
          address: fakeAddress,
        },
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

  it('allows user with enough voting weight to cancel', async () => {
    (getCurrentVotes as jest.Mock).mockImplementation(() => ({
      votesWei: new BigNumber(CREATE_PROPOSAL_THRESHOLD_WEI),
    }));
    const { getByText } = renderComponent(<Proposal />, {
      authContextValue: {
        account: {
          address: fakeAddress,
        },
      },
    });

    const cancelButton = await waitFor(
      async () => getByText(en.voteProposalUi.cancel).closest('button') as HTMLButtonElement,
    );

    act(() => {
      fireEvent.click(cancelButton);
    });
    await waitFor(() => expect(cancelButton).toBeEnabled());
    expect(cancelProposal).toBeCalledWith({ accountAddress: fakeAddress, proposalId: 97 });
  });

  it('user with not enough voting weight cannot cancel', async () => {
    (getCurrentVotes as jest.Mock).mockImplementation(() => ({ votesWei: new BigNumber(0) }));
    const { getByTestId } = renderComponent(<Proposal />, {
      authContextValue: {
        account: {
          address: fakeAddress,
        },
      },
    });
    const cancelButton = await waitFor(async () =>
      getByTestId(PROPOSAL_SUMMARY_TEST_IDS.cancelButton),
    );
    expect(cancelButton).toBeDisabled();
  });

  it('user can queue succeeded proposal', async () => {
    (getProposal as jest.Mock).mockImplementationOnce(() => succeededProposal);
    const { getByTestId } = renderComponent(<Proposal />, {
      authContextValue: {
        account: {
          address: fakeAddress,
        },
      },
    });
    const queueButton = await waitFor(async () =>
      getByTestId(PROPOSAL_SUMMARY_TEST_IDS.queueButton),
    );
    act(() => {
      fireEvent.click(queueButton);
    });
    await waitFor(() =>
      expect(queueProposal).toBeCalledWith({ accountAddress: fakeAddress, proposalId: 95 }),
    );
  });

  it('user can execute queued proposal', async () => {
    (getProposal as jest.Mock).mockImplementationOnce(() => queuedProposal);
    const { getByTestId } = renderComponent(<Proposal />, {
      authContextValue: {
        account: {
          address: fakeAddress,
        },
      },
    });
    const executeButton = await waitFor(async () =>
      getByTestId(PROPOSAL_SUMMARY_TEST_IDS.executeButton),
    );
    act(() => {
      fireEvent.click(executeButton);
    });
    await waitFor(() =>
      expect(executeProposal).toBeCalledWith({ accountAddress: fakeAddress, proposalId: 98 }),
    );
  });
});
