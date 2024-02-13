import { Matcher, MatcherOptions, fireEvent, waitFor, within } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import { Navigate } from 'react-router-dom';
import Vi from 'vitest';

import fakeAddress from '__mocks__/models/address';
import proposals from '__mocks__/models/proposals';
import voters from '__mocks__/models/voters';
import { renderComponent } from 'testUtils/render';

import {
  cancelProposal,
  executeProposal,
  getCurrentVotes,
  getProposal,
  getProposalThreshold,
  getVoteReceipt,
  queueProposal,
} from 'clients/api';
import CREATE_PROPOSAL_THRESHOLD_MANTISSA from 'constants/createProposalThresholdMantissa';
import { routes } from 'constants/routing';
import { UseIsFeatureEnabled, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import useVote from 'hooks/useVote';
import { VError } from 'libs/errors';
import { en } from 'libs/translations';
import { VoteSupport } from 'types';

import Proposal from '.';
import PROPOSAL_SUMMARY_TEST_IDS from './ProposalSummary/testIds';
import VOTE_MODAL_TEST_IDS from './VoteModal/testIds';
import TEST_IDS from './testIds';

vi.mock('hooks/useVote');
vi.mock('hooks/useIsFeatureEnabled');

const MOCK_NAVIGATE_CONTENT = 'Mock navigate';

vi.mock('react-router-dom', async () => {
  const actual = (await vi.importActual('react-router-dom')) as any;

  return {
    ...actual,
    Navigate: vi.fn(() => <>{MOCK_NAVIGATE_CONTENT}</>),
  };
});

const incorrectAction = proposals[0];
const activeProposal = proposals[1];
const cancelledProposal = proposals[3];
const succeededProposal = proposals[4];
const queuedProposal = proposals[5];

const checkVoteButtonsAreHidden = async (
  queryByTestId: (id: Matcher, options?: MatcherOptions | undefined) => HTMLElement | null,
) => {
  await waitFor(() => expect(queryByTestId(TEST_IDS.voteSummary.for)).toBeNull());
  waitFor(() => expect(queryByTestId(TEST_IDS.voteSummary.against)).toBeNull());
  waitFor(() => expect(queryByTestId(TEST_IDS.voteSummary.abstain)).toBeNull());
};

describe('pages/Proposal', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(
      activeProposal.endDate!.setMinutes(activeProposal.endDate!.getMinutes() - 5),
    );

    (getVoteReceipt as Vi.Mock).mockImplementation(() => ({
      voteSupport: undefined,
    }));
    (getProposal as Vi.Mock).mockImplementation(() => activeProposal);

    (getProposalThreshold as Vi.Mock).mockImplementation(() => ({
      thresholdMantissa: CREATE_PROPOSAL_THRESHOLD_MANTISSA,
    }));

    (useVote as Vi.Mock).mockImplementation(() => ({
      vote: vi.fn(),
      isLoading: false,
    }));

    (useIsFeatureEnabled as Vi.Mock).mockImplementation(
      () =>
        ({ name }: UseIsFeatureEnabled) =>
          name === 'voteProposal',
    );

    (getCurrentVotes as Vi.Mock).mockImplementation(() => ({
      votesMantissa: new BigNumber('100000000000000000'),
    }));
  });

  it('renders without crashing', async () => {
    renderComponent(<Proposal />);
  });

  it('renders without crashing on', async () => {
    (getProposal as Vi.Mock).mockImplementation(() => incorrectAction);
    renderComponent(<Proposal />);
  });

  it('redirects to proposal page on error', async () => {
    (getProposal as Vi.Mock).mockImplementation(() => {
      throw new VError({
        type: 'unexpected',
        code: 'somethingWentWrong',
        data: { message: 'Fake error message' },
      });
    });
    const { getByText } = renderComponent(<Proposal />);

    await waitFor(() => expect(getByText(MOCK_NAVIGATE_CONTENT)));
    expect(Navigate).toHaveBeenCalledWith(
      {
        to: routes.governance.path,
      },
      {},
    );
  });

  it('vote buttons are hidden when wallet is not connected', async () => {
    const { queryByTestId } = renderComponent(<Proposal />);

    await checkVoteButtonsAreHidden(queryByTestId);
  });

  it('vote buttons are hidden when proposal is not active', async () => {
    (getProposal as Vi.Mock).mockImplementationOnce(() => cancelledProposal);

    const { queryByTestId } = renderComponent(<Proposal />, {
      accountAddress: fakeAddress,
    });

    await checkVoteButtonsAreHidden(queryByTestId);
  });

  it('vote buttons are hidden when vote is cast', async () => {
    (getVoteReceipt as Vi.Mock).mockImplementation(() => ({
      voteSupport: VoteSupport.For,
    }));

    const { queryByTestId } = renderComponent(<Proposal />, {
      accountAddress: fakeAddress,
    });

    await checkVoteButtonsAreHidden(queryByTestId);
  });

  it('vote buttons are hidden when voting weight is 0', async () => {
    (getCurrentVotes as Vi.Mock).mockImplementation(() => ({ votesMantissa: new BigNumber(0) }));

    const { queryByTestId } = renderComponent(<Proposal />, {
      accountAddress: fakeAddress,
    });

    await checkVoteButtonsAreHidden(queryByTestId);
  });

  it('vote buttons are hidden when vote feature is disabled', async () => {
    (useIsFeatureEnabled as Vi.Mock).mockImplementation(() => false);
    const { queryByTestId } = renderComponent(<Proposal />, {
      accountAddress: fakeAddress,
    });

    await checkVoteButtonsAreHidden(queryByTestId);
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
    (getCurrentVotes as Vi.Mock).mockImplementation(() => ({ votesMantissa: new BigNumber(0) }));
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
    (getCurrentVotes as Vi.Mock).mockImplementation(() => ({
      votesMantissa: new BigNumber(CREATE_PROPOSAL_THRESHOLD_MANTISSA),
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
    (getCurrentVotes as Vi.Mock).mockImplementation(() => ({ votesMantissa: new BigNumber(0) }));
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
    (getProposal as Vi.Mock).mockImplementationOnce(() => succeededProposal);
    const { getByTestId } = renderComponent(<Proposal />, {
      accountAddress: fakeAddress,
    });
    const queueButton = await waitFor(async () =>
      getByTestId(PROPOSAL_SUMMARY_TEST_IDS.queueButton),
    );
    fireEvent.click(queueButton);
    await waitFor(() => expect(queueProposal).toBeCalledWith({ proposalId: 94 }));
  });

  it('user can execute queued proposal', async () => {
    (getProposal as Vi.Mock).mockImplementationOnce(() => queuedProposal);
    const { getByTestId } = renderComponent(<Proposal />, {
      accountAddress: fakeAddress,
    });
    const executeButton = await waitFor(async () =>
      getByTestId(PROPOSAL_SUMMARY_TEST_IDS.executeButton),
    );
    fireEvent.click(executeButton);
    await waitFor(() => expect(executeProposal).toBeCalledWith({ proposalId: 93 }));
  });
});
