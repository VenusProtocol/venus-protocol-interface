import {
  type Matcher,
  type SelectorMatcherOptions,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type Vi from 'vitest';

import fakeAddress from '__mocks__/models/address';
import proposals from '__mocks__/models/proposals';
import voters from '__mocks__/models/voters';
import { renderComponent } from 'testUtils/render';

import {
  cancelProposal,
  executeProposal,
  queueProposal,
  useGetCurrentVotes,
  useGetProposal,
  useGetProposalThreshold,
  useGetVoteReceipt,
} from 'clients/api';
import CREATE_PROPOSAL_THRESHOLD_MANTISSA from 'constants/createProposalThresholdMantissa';
import { type UseIsFeatureEnabled, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import useVote from 'hooks/useVote';
import { VError } from 'libs/errors';
import { en } from 'libs/translations';
import { VoteSupport } from 'types';

import { REDIRECT_TEST_CONTENT } from 'components/Redirect/__mocks__';
import Proposal from '..';
import PROPOSAL_SUMMARY_TEST_IDS from '../ProposalSummary/testIds';
import VOTE_MODAL_TEST_IDS from '../VoteModal/testIds';
import TEST_IDS from '../testIds';

vi.mock('hooks/useVote');
vi.mock('hooks/useIsFeatureEnabled');

const activeProposal = proposals[1];
const canceledProposal = proposals[3];
const succeededProposal = proposals[4];
const queuedProposal = proposals[5];

const checkVoteButtonsAreHidden = async (
  queryByText: (id: Matcher, options?: SelectorMatcherOptions | undefined) => HTMLElement | null,
) => {
  await waitFor(() => expect(queryByText(en.vote.for, { selector: 'button' })).toBeNull());
  waitFor(() => expect(queryByText(en.vote.against, { selector: 'button' })).toBeNull());
  waitFor(() => expect(queryByText(en.vote.abstain, { selector: 'button' })).toBeNull());
};

describe('Proposal page', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(
      activeProposal.endDate!.setMinutes(activeProposal.endDate!.getMinutes() - 5),
    );

    (useGetVoteReceipt as Vi.Mock).mockImplementation(() => ({
      data: {
        voteSupport: undefined,
      },
    }));

    (useGetProposal as Vi.Mock).mockImplementation(() => ({
      data: activeProposal,
    }));

    (useGetProposalThreshold as Vi.Mock).mockImplementation(() => ({
      data: {
        thresholdMantissa: CREATE_PROPOSAL_THRESHOLD_MANTISSA,
      },
    }));

    (useIsFeatureEnabled as Vi.Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabled) => name === 'voteProposal',
    );

    (useGetCurrentVotes as Vi.Mock).mockImplementation(() => ({
      data: {
        votesMantissa: new BigNumber('100000000000000000'),
      },
    }));
  });

  it('renders without crashing', async () => {
    renderComponent(<Proposal />);
  });

  it('redirects to proposal page on error', async () => {
    (useGetProposal as Vi.Mock).mockImplementation(() => ({
      error: new VError({
        type: 'unexpected',
        code: 'somethingWentWrong',
        data: { message: 'Fake error message' },
      }),
    }));
    const { getByText } = renderComponent(<Proposal />);

    await waitFor(() => expect(getByText(REDIRECT_TEST_CONTENT)));
  });

  it('vote buttons are hidden when wallet is not connected', async () => {
    const { queryByText } = renderComponent(<Proposal />);

    await checkVoteButtonsAreHidden(queryByText);
  });

  it('vote buttons are hidden when proposal is not active', async () => {
    (useGetProposal as Vi.Mock).mockImplementation(() => ({
      data: canceledProposal,
    }));

    const { queryByText } = renderComponent(<Proposal />, {
      accountAddress: fakeAddress,
    });

    await checkVoteButtonsAreHidden(queryByText);
  });

  it('vote buttons are hidden when vote is cast', async () => {
    (useGetVoteReceipt as Vi.Mock).mockImplementation(() => ({
      data: {
        voteSupport: VoteSupport.For,
      },
    }));

    const { queryByText } = renderComponent(<Proposal />, {
      accountAddress: fakeAddress,
    });

    await checkVoteButtonsAreHidden(queryByText);
  });

  it('vote buttons are hidden when voting weight is 0', async () => {
    (useGetCurrentVotes as Vi.Mock).mockImplementation(() => ({
      data: { votesMantissa: new BigNumber(0) },
    }));

    const { queryByText } = renderComponent(<Proposal />, {
      accountAddress: fakeAddress,
    });

    await checkVoteButtonsAreHidden(queryByText);
  });

  it('vote buttons are hidden when vote feature is disabled', async () => {
    (useIsFeatureEnabled as Vi.Mock).mockImplementation(() => false);
    const { queryByText } = renderComponent(<Proposal />, {
      accountAddress: fakeAddress,
    });

    await checkVoteButtonsAreHidden(queryByText);
  });

  it('vote buttons are displayed and enabled when requirements are met', async () => {
    const { getByTestId } = renderComponent(<Proposal />, {
      accountAddress: fakeAddress,
    });

    const voteForButton = await waitFor(async () =>
      within(getByTestId(TEST_IDS.voteSummary.for)).getByRole('button'),
    );
    expect(voteForButton).toBeEnabled();

    const voteAgainstButton = await waitFor(async () =>
      within(getByTestId(TEST_IDS.voteSummary.against)).getByRole('button'),
    );
    expect(voteAgainstButton).toBeEnabled();

    const voteAbstainButton = await waitFor(async () =>
      within(getByTestId(TEST_IDS.voteSummary.abstain)).getByRole('button'),
    );
    expect(voteAbstainButton).toBeEnabled();
  });

  it('does not render the voting disabled warning when feature flag is enabled', async () => {
    const { queryByTestId } = renderComponent(<Proposal />, {
      accountAddress: fakeAddress,
    });

    await waitFor(() => expect(queryByTestId(TEST_IDS.votingDisabledWarning)).toBeNull());
  });

  it('renders warning about voting being disabled when the feature flag is off', async () => {
    (useIsFeatureEnabled as Vi.Mock).mockImplementation(() => false);

    const { getByTestId } = renderComponent(<Proposal />, {
      accountAddress: fakeAddress,
    });

    await waitFor(() => expect(getByTestId(TEST_IDS.votingDisabledWarning)).toBeVisible());
  });

  it('allows user to vote for', async () => {
    const vote = vi.fn();
    (useVote as Vi.Mock).mockImplementation(() => ({
      vote,
      isLoading: false,
    }));
    const { getByTestId, getByLabelText } = renderComponent(<Proposal />, {
      accountAddress: fakeAddress,
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
      accountAddress: fakeAddress,
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
      accountAddress: fakeAddress,
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
    const { getByTestId } = renderComponent(<Proposal />, {
      accountAddress: fakeAddress,
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
    (useGetCurrentVotes as Vi.Mock).mockImplementation(() => ({
      data: { votesMantissa: new BigNumber(0) },
    }));

    const proposerAddress = activeProposal.proposer;
    const { getByTestId } = renderComponent(<Proposal />, {
      accountAddress: proposerAddress,
    });
    const cancelButton = await waitFor(async () =>
      getByTestId(PROPOSAL_SUMMARY_TEST_IDS.cancelButton),
    );

    fireEvent.click(cancelButton);
    await waitFor(() => expect(cancelButton).toBeEnabled());
    expect(cancelProposal).toBeCalledWith({ proposalId: 97 });
  });

  it('does not allow user to cancel if voting power of the proposer is greater than or equals threshold', async () => {
    (useGetCurrentVotes as Vi.Mock).mockImplementation(() => ({
      data: {
        votesMantissa: new BigNumber(CREATE_PROPOSAL_THRESHOLD_MANTISSA),
      },
    }));

    const { getByTestId } = renderComponent(<Proposal />, {
      accountAddress: fakeAddress,
    });

    const cancelButton = await waitFor(async () =>
      getByTestId(PROPOSAL_SUMMARY_TEST_IDS.cancelButton),
    );

    await waitFor(() => expect(cancelButton).toBeDisabled());
  });

  it('user can cancel if voting power of the proposer dropped below threshold', async () => {
    (useGetCurrentVotes as Vi.Mock).mockImplementation(() => ({
      data: {
        votesMantissa: new BigNumber(0),
      },
    }));

    const { getByTestId } = renderComponent(<Proposal />, {
      accountAddress: fakeAddress,
    });
    const cancelButton = await waitFor(async () =>
      getByTestId(PROPOSAL_SUMMARY_TEST_IDS.cancelButton),
    );

    fireEvent.click(cancelButton);

    await waitFor(() => expect(cancelButton).toBeEnabled());
    expect(cancelProposal).toBeCalledWith({ proposalId: 97 });
  });

  it('user can queue succeeded proposal', async () => {
    (useGetProposal as Vi.Mock).mockImplementation(() => ({
      data: succeededProposal,
    }));

    const { getByTestId } = renderComponent(<Proposal />, {
      accountAddress: fakeAddress,
    });

    const queueButton = await waitFor(async () =>
      getByTestId(PROPOSAL_SUMMARY_TEST_IDS.queueButton),
    );
    fireEvent.click(queueButton);
    await waitFor(() => expect(queueButton).toBeEnabled());

    await waitFor(() => expect(queueProposal).toBeCalledWith({ proposalId: 94 }));
  });

  it('user can execute queued proposal', async () => {
    (useGetProposal as Vi.Mock).mockImplementation(() => ({
      data: queuedProposal,
    }));

    const { getByTestId } = renderComponent(<Proposal />, {
      accountAddress: fakeAddress,
    });
    const executeButton = await waitFor(async () =>
      getByTestId(PROPOSAL_SUMMARY_TEST_IDS.executeButton),
    );
    fireEvent.click(executeButton);
    await waitFor(() => expect(executeButton).toBeEnabled());

    await waitFor(() => expect(executeProposal).toBeCalledWith({ proposalId: 93 }));
  });
});
