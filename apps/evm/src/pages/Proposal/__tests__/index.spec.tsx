import {
  type Matcher,
  type SelectorMatcherOptions,
  fireEvent,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { proposals } from '__mocks__/models/proposals';
import voters from '__mocks__/models/voters';
import { renderComponent } from 'testUtils/render';

import {
  useCancelProposal,
  useExecuteProposal,
  useGetCurrentVotes,
  useGetProposal,
  useGetProposalThreshold,
  useGetVoteReceipt,
  useQueueProposal,
  useVote,
} from 'clients/api';
import CREATE_PROPOSAL_THRESHOLD_MANTISSA from 'constants/createProposalThresholdMantissa';
import { type UseIsFeatureEnabled, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { VError } from 'libs/errors';
import { en } from 'libs/translations';
import {
  ChainId,
  type Proposal,
  ProposalState,
  type RemoteProposal,
  RemoteProposalState,
  VoteSupport,
} from 'types';

import config from 'config';
import { REDIRECT_TEST_CONTENT } from 'containers/Redirect/__mocks__';
import { useNow } from 'hooks/useNow';
import ProposalComp from '..';
import VOTE_MODAL_TEST_IDS from '../VoteModal/testIds';
import TEST_IDS from '../testIds';

vi.mock('hooks/useNow');
vi.mock('hooks/useIsFeatureEnabled');
vi.mock('containers/Redirect');

const proposal = proposals[0];
const remoteProposal: RemoteProposal = {
  proposalId: 1,
  remoteProposalId: 1,
  chainId: ChainId.BSC_TESTNET,
  state: RemoteProposalState.Pending,
  proposalActions: [],
};

const activeProposal = proposals[1];
const defeatedProposal = proposals[3];
const succeededProposal = proposals[4];
const queuedProposal = proposals[5];

const fakeNow = new Date(
  activeProposal.endDate!.setMinutes(activeProposal.endDate!.getMinutes() - 5),
);

const checkVoteButtonsAreHidden = (
  queryByText: (id: Matcher, options?: SelectorMatcherOptions | undefined) => HTMLElement | null,
) => {
  expect(queryByText(en.vote.for, { selector: 'button' })).not.toBeInTheDocument();
  expect(queryByText(en.vote.against, { selector: 'button' })).not.toBeInTheDocument();
  expect(queryByText(en.vote.abstain, { selector: 'button' })).not.toBeInTheDocument();
};

// TODO: rename to "Proposal"
describe('ProposalComp page', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(fakeNow);

    (useNow as Mock).mockImplementation(() => fakeNow);

    (useGetVoteReceipt as Mock).mockImplementation(() => ({
      data: {
        voteSupport: undefined,
      },
    }));

    (useGetProposal as Mock).mockImplementation(() => ({
      data: {
        proposal: activeProposal,
      },
    }));

    (useGetProposalThreshold as Mock).mockImplementation(() => ({
      data: {
        thresholdMantissa: CREATE_PROPOSAL_THRESHOLD_MANTISSA,
      },
    }));

    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabled) => name === 'voteProposal',
    );

    (useGetCurrentVotes as Mock).mockImplementation(() => ({
      data: {
        votesMantissa: new BigNumber('100000000000000000'),
      },
    }));
  });

  it('renders without crashing', async () => {
    renderComponent(<ProposalComp />);
  });

  it('redirects to proposal page on error', async () => {
    (useGetProposal as Mock).mockImplementation(() => ({
      error: new VError({
        type: 'unexpected',
        code: 'somethingWentWrong',
        data: { message: 'Fake error message' },
      }),
    }));
    const { getByText } = renderComponent(<ProposalComp />);

    await waitFor(() => expect(getByText(REDIRECT_TEST_CONTENT)));
  });

  it('vote buttons are hidden when wallet is not connected', async () => {
    renderComponent(<ProposalComp />);

    checkVoteButtonsAreHidden(screen.queryByText);
  });

  it('vote buttons are hidden when proposal is not active', async () => {
    (useGetProposal as Mock).mockImplementation(() => ({
      data: {
        proposal: defeatedProposal,
      },
    }));

    renderComponent(<ProposalComp />, {
      accountAddress: fakeAccountAddress,
    });

    checkVoteButtonsAreHidden(screen.queryByText);
  });

  it('vote buttons are hidden when user has already voted', async () => {
    (useGetVoteReceipt as Mock).mockImplementation(() => ({
      data: {
        voteSupport: VoteSupport.For,
      },
    }));

    const { queryByText } = renderComponent(<ProposalComp />, {
      accountAddress: fakeAccountAddress,
    });

    checkVoteButtonsAreHidden(queryByText);
  });

  it('vote buttons are hidden when voting weight is 0', async () => {
    (useGetCurrentVotes as Mock).mockImplementation(() => ({
      data: { votesMantissa: new BigNumber(0) },
    }));

    const { queryByText } = renderComponent(<ProposalComp />, {
      accountAddress: fakeAccountAddress,
    });

    checkVoteButtonsAreHidden(queryByText);
  });

  it('vote buttons are hidden when vote feature is disabled', async () => {
    (useIsFeatureEnabled as Mock).mockImplementation(() => false);
    const { queryByText } = renderComponent(<ProposalComp />, {
      accountAddress: fakeAccountAddress,
    });

    checkVoteButtonsAreHidden(queryByText);
  });

  it('vote buttons are hidden when user is connected to another chain than the governance one', async () => {
    const { queryByText } = renderComponent(<ProposalComp />, {
      accountAddress: fakeAccountAddress,
      accountChainId: ChainId.ARBITRUM_SEPOLIA,
    });

    checkVoteButtonsAreHidden(queryByText);
  });

  it('vote buttons are displayed and enabled when requirements are met', async () => {
    renderComponent(<ProposalComp />, {
      accountAddress: fakeAccountAddress,
    });

    const voteForButton = await waitFor(async () =>
      within(screen.getByTestId(TEST_IDS.voteSummary.for)).getByRole('button'),
    );
    expect(voteForButton).toBeEnabled();

    const voteAgainstButton = await waitFor(async () =>
      within(screen.getByTestId(TEST_IDS.voteSummary.against)).getByRole('button'),
    );
    expect(voteAgainstButton).toBeEnabled();

    const voteAbstainButton = await waitFor(async () =>
      within(screen.getByTestId(TEST_IDS.voteSummary.abstain)).getByRole('button'),
    );
    expect(voteAbstainButton).toBeEnabled();
  });

  it('does not render the voting disabled warning when feature flag is enabled', async () => {
    const { queryByTestId } = renderComponent(<ProposalComp />, {
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() => expect(queryByTestId(TEST_IDS.votingDisabledWarning)).toBeNull());
  });

  it('renders warning about voting being disabled when the feature flag is off and proposal is active', async () => {
    (useIsFeatureEnabled as Mock).mockImplementation(() => false);

    renderComponent(<ProposalComp />, {
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() => expect(screen.getByTestId(TEST_IDS.votingDisabledWarning)).toBeVisible());
  });

  it('renders warning about voting being disabled when the feature flag is on, proposal is active and user is connected to another chain than the governance one', async () => {
    (useIsFeatureEnabled as Mock).mockImplementation(() => true);

    renderComponent(<ProposalComp />, {
      accountAddress: fakeAccountAddress,
      accountChainId: ChainId.ARBITRUM_SEPOLIA,
    });

    await waitFor(() => expect(screen.getByTestId(TEST_IDS.votingDisabledWarning)).toBeVisible());
  });

  it('allows user to vote for', async () => {
    const vote = vi.fn();
    (useVote as Mock).mockImplementation(() => ({
      mutateAsync: vote,
      isPending: false,
    }));
    renderComponent(<ProposalComp />, {
      accountAddress: fakeAccountAddress,
    });

    const voteButton = await waitFor(async () =>
      within(screen.getByTestId(TEST_IDS.voteSummary.for)).getByRole('button'),
    );
    fireEvent.click(voteButton);

    const votingPower = await waitFor(async () => screen.getByLabelText(en.vote.votingPower));
    expect(votingPower).toHaveValue('0.1');

    const castButton = await waitFor(async () =>
      screen.getByTestId(VOTE_MODAL_TEST_IDS.submitButton),
    );
    expect(castButton).toBeEnabled();
    fireEvent.click(castButton);
    await waitFor(() =>
      expect(vote).toHaveBeenCalledWith({
        proposalId: activeProposal.proposalId,
        voteReason: '',
        voteType: 1,
      }),
    );
  });

  it('allows user to vote against with reason', async () => {
    const vote = vi.fn();
    (useVote as Mock).mockImplementation(() => ({
      mutateAsync: vote,
      isPending: false,
    }));

    const comment = 'Not a good idea';
    renderComponent(<ProposalComp />, {
      accountAddress: fakeAccountAddress,
    });

    const voteButton = await waitFor(async () =>
      within(screen.getByTestId(TEST_IDS.voteSummary.against)).getByRole('button'),
    );
    fireEvent.click(voteButton);

    const votingPower = await waitFor(async () => screen.getByLabelText(en.vote.votingPower));
    expect(votingPower).toHaveValue('0.1');

    const commentInput = await waitFor(async () => screen.getByLabelText(en.vote.comment));
    fireEvent.change(commentInput, { target: { value: comment } });

    const castButton = await waitFor(async () =>
      screen.getByTestId(VOTE_MODAL_TEST_IDS.submitButton),
    );
    expect(castButton).toBeEnabled();
    fireEvent.click(castButton);

    await waitFor(() =>
      expect(vote).toHaveBeenCalledWith({
        proposalId: activeProposal.proposalId,
        voteReason: comment,
        voteType: 0,
      }),
    );
  });

  it('allows user to vote abstain', async () => {
    const vote = vi.fn();
    (useVote as Mock).mockImplementation(() => ({
      mutateAsync: vote,
      isPending: false,
    }));

    renderComponent(<ProposalComp />, {
      accountAddress: fakeAccountAddress,
    });

    const voteButton = await waitFor(async () =>
      within(screen.getByTestId(TEST_IDS.voteSummary.abstain)).getByRole('button'),
    );
    fireEvent.click(voteButton);

    const votingPower = await waitFor(async () => screen.getByLabelText(en.vote.votingPower));
    expect(votingPower).toHaveValue('0.1');

    const castButton = await waitFor(async () =>
      screen.getByTestId(VOTE_MODAL_TEST_IDS.submitButton),
    );
    expect(castButton).toBeEnabled();
    fireEvent.click(castButton);
    await waitFor(() =>
      expect(vote).toHaveBeenCalledWith({
        proposalId: activeProposal.proposalId,
        voteReason: '',
        voteType: 2,
      }),
    );
  });

  it('lists votes cast', async () => {
    renderComponent(<ProposalComp />, {
      accountAddress: fakeAccountAddress,
    });
    const againstVoteSummary = await waitFor(async () =>
      within(screen.getByTestId(TEST_IDS.voteSummary.against)),
    );
    againstVoteSummary.getByText(voters.result[0].address);

    const forVoteSummary = await waitFor(async () =>
      within(screen.getByTestId(TEST_IDS.voteSummary.for)),
    );
    forVoteSummary.getByText(voters.result[1].address);

    const abstainVoteSummary = await waitFor(async () =>
      within(screen.getByTestId(TEST_IDS.voteSummary.abstain)),
    );
    abstainVoteSummary.getByText(voters.result[2].address);
  });

  it.each([
    // Pending
    {
      ...proposal,
      state: ProposalState.Pending,
      remoteProposals: [],
    },
    // Active
    {
      ...activeProposal,
      remoteProposals: [],
    },
    // Canceled
    {
      ...proposal,
      state: ProposalState.Canceled,
      remoteProposals: [],
    },
    // Defeated
    {
      ...proposal,
      state: ProposalState.Defeated,
      remoteProposals: [],
    },
    // Succeeded
    {
      ...proposal,
      state: ProposalState.Succeeded,
      remoteProposals: [],
    },
    // Queued (not yet executable)
    {
      ...proposal,
      state: ProposalState.Queued,
      executionEtaDate: new Date(fakeNow.getTime() + 1000),
      remoteProposals: [],
    },
    // Executable
    {
      ...proposal,
      state: ProposalState.Queued,
      executionEtaDate: new Date(fakeNow.getTime() - 1000),
      remoteProposals: [],
    },
    // Expired
    {
      ...proposal,
      state: ProposalState.Expired,
      expiredDate: fakeNow,
      remoteProposals: [],
    },
    // Executed
    {
      ...proposal,
      state: ProposalState.Executed,
      executedDate: fakeNow,
      remoteProposals: [],
    },
  ])('renders BSC command correctly. ProposalComp state: $state', async proposal => {
    (useGetProposal as Mock).mockImplementation(() => ({
      data: {
        proposal,
      },
    }));

    renderComponent(<ProposalComp />, {
      accountAddress: fakeAccountAddress,
    });

    expect(screen.getByTestId(TEST_IDS.commands).textContent).toMatchSnapshot();
  });

  it.each([
    // Pending
    remoteProposal,
    // Bridged
    {
      ...remoteProposal,
      state: RemoteProposalState.Bridged,
      bridgedDate: fakeNow,
    },

    // Queued (not yet executable)
    {
      ...remoteProposal,
      state: RemoteProposalState.Queued,
      queuedDate: fakeNow,
      executionEtaDate: new Date(fakeNow.getTime() + 1000),
    },
    // Executable
    {
      ...remoteProposal,
      state: RemoteProposalState.Queued,
      queuedDate: fakeNow,
      executionEtaDate: new Date(fakeNow.getTime() - 1000),
    },
    // Canceled
    {
      ...remoteProposal,
      state: RemoteProposalState.Canceled,
      canceledDate: fakeNow,
    },
    // Expired
    {
      ...remoteProposal,
      state: RemoteProposalState.Expired,
      expiredDate: fakeNow,
    },
    // Executed
    {
      ...remoteProposal,
      state: RemoteProposalState.Executed,
      executedDate: fakeNow,
    },
    // Failed
    {
      ...remoteProposal,
      state: RemoteProposalState.Failed,
      failedDate: fakeNow,
    },
  ])('renders remote commands correctly. Remote proposal state: $state', async remoteProposal => {
    const customProposal: Proposal = {
      ...proposal,
      state: ProposalState.Executed,
      executedDate: fakeNow,
      remoteProposals: [remoteProposal],
    };

    (useGetProposal as Mock).mockImplementation(() => ({
      data: {
        proposal: customProposal,
      },
    }));

    renderComponent(<ProposalComp />, {
      accountAddress: fakeAccountAddress,
    });

    expect(screen.getByTestId(TEST_IDS.commands).textContent).toMatchSnapshot();
  });

  it('lets user cancel their own BSC proposal', async () => {
    const cancelMock = vi.fn();
    (useCancelProposal as Mock).mockImplementation(() => ({
      mutateAsync: cancelMock,
    }));

    renderComponent(<ProposalComp />, {
      accountAddress: activeProposal.proposerAddress,
    });

    const cancelButton = screen
      .getAllByText(en.voteProposalUi.command.actionButton.cancel)[0]
      .closest('button');
    expect(cancelButton).toBeInTheDocument();

    fireEvent.click(cancelButton!);

    await waitFor(() => expect(cancelMock).toHaveBeenCalledTimes(1));
    expect(cancelMock).toHaveBeenCalledWith({
      proposalId: activeProposal.proposalId,
    });
  });

  it('lets user cancel the BSC proposal if the proposer no longer has enough voting power', async () => {
    const FAKE_THRESHOLD_MANTISSA = 100;

    (useGetProposalThreshold as Mock).mockImplementation(() => ({
      data: {
        thresholdMantissa: new BigNumber(FAKE_THRESHOLD_MANTISSA),
      },
    }));

    (useGetCurrentVotes as Mock).mockImplementation(() => ({
      data: {
        votesMantissa: new BigNumber(FAKE_THRESHOLD_MANTISSA - 1),
      },
    }));

    const cancelMock = vi.fn();
    (useCancelProposal as Mock).mockImplementation(() => ({
      mutateAsync: cancelMock,
    }));

    renderComponent(<ProposalComp />, {
      accountAddress: fakeAccountAddress,
    });

    const cancelButton = screen
      .getAllByText(en.voteProposalUi.command.actionButton.cancel)[0]
      .closest('button');
    expect(cancelButton).toBeInTheDocument();

    fireEvent.click(cancelButton!);

    await waitFor(() => expect(cancelMock).toHaveBeenCalledTimes(1));
    expect(cancelMock).toHaveBeenCalledWith({
      proposalId: activeProposal.proposalId,
    });
  });

  it('does not let user cancel the BSC proposal if voting power of the proposer is greater than or equals threshold', async () => {
    (useGetCurrentVotes as Mock).mockImplementation(() => ({
      data: {
        votesMantissa: CREATE_PROPOSAL_THRESHOLD_MANTISSA,
      },
    }));

    const cancelMock = vi.fn();
    (useCancelProposal as Mock).mockImplementation(() => ({
      mutateAsync: cancelMock,
    }));

    renderComponent(<ProposalComp />, {
      accountAddress: fakeAccountAddress,
    });

    expect(
      screen.queryByText(en.voteProposalUi.command.actionButton.cancel),
    ).not.toBeInTheDocument();
  });

  it('does not let user cancel the BSC proposal if it has passed the succeeded state', async () => {
    (useGetProposal as Mock).mockImplementation(() => ({
      data: {
        proposal: succeededProposal,
      },
    }));

    const cancelMock = vi.fn();
    (useCancelProposal as Mock).mockImplementation(() => ({
      mutateAsync: cancelMock,
    }));

    renderComponent(<ProposalComp />, {
      accountAddress: activeProposal.proposerAddress,
    });

    expect(
      screen.queryByText(en.voteProposalUi.command.actionButton.cancel),
    ).not.toBeInTheDocument();
  });

  it('lets user queue the BSC proposal', async () => {
    (useGetProposal as Mock).mockImplementation(() => ({
      data: {
        proposal: succeededProposal,
      },
    }));

    const queueMock = vi.fn();
    (useQueueProposal as Mock).mockImplementation(() => ({
      mutateAsync: queueMock,
    }));

    renderComponent(<ProposalComp />, {
      accountAddress: fakeAccountAddress,
    });

    const queueButton = screen
      .getAllByText(en.voteProposalUi.command.actionButton.queue)[0]
      .closest('button');
    expect(queueButton).toBeInTheDocument();

    fireEvent.click(queueButton!);

    await waitFor(() => expect(queueMock).toHaveBeenCalledTimes(1));
  });

  it('lets user queue the BSC proposal', async () => {
    (useGetProposal as Mock).mockImplementation(() => ({
      data: {
        proposal: succeededProposal,
      },
    }));

    const queueMock = vi.fn();
    (useQueueProposal as Mock).mockImplementation(() => ({
      mutateAsync: queueMock,
    }));

    renderComponent(<ProposalComp />, {
      accountAddress: fakeAccountAddress,
    });

    const queueButton = screen
      .getAllByText(en.voteProposalUi.command.actionButton.queue)[0]
      .closest('button');
    expect(queueButton).toBeInTheDocument();

    fireEvent.click(queueButton!);

    await waitFor(() => expect(queueMock).toHaveBeenCalledTimes(1));
  });

  it('lets user execute the BSC proposal', async () => {
    const customProposal: Proposal = {
      ...queuedProposal,
      executionEtaDate: new Date(fakeNow.getTime() - 1000),
    };

    (useGetProposal as Mock).mockImplementation(() => ({
      data: {
        proposal: customProposal,
      },
    }));

    const executeMock = vi.fn();
    (useExecuteProposal as Mock).mockImplementation(() => ({
      mutateAsync: executeMock,
    }));

    renderComponent(<ProposalComp />, {
      accountAddress: fakeAccountAddress,
    });

    const executeButton = screen
      .getAllByText(en.voteProposalUi.command.actionButton.execute)[0]
      .closest('button');
    expect(executeButton).toBeInTheDocument();

    fireEvent.click(executeButton!);

    await waitFor(() => expect(executeMock).toHaveBeenCalledTimes(1));
    expect(executeMock).toHaveBeenCalledWith({
      proposalId: customProposal.proposalId,
      chainId: ChainId.BSC_TESTNET,
    });
  });

  it('lets user execute a remote proposal', async () => {
    const executableRemoteProposal: RemoteProposal = {
      ...queuedProposal.remoteProposals[3],
      executionEtaDate: new Date(fakeNow.getTime() - 1000),
    };

    const executedProposal: Proposal = {
      ...proposal,
      remoteProposals: [executableRemoteProposal],
    };

    (useGetProposal as Mock).mockImplementation(() => ({
      data: {
        proposal: executedProposal,
      },
    }));

    const executeMock = vi.fn();
    (useExecuteProposal as Mock).mockImplementation(() => ({
      mutateAsync: executeMock,
    }));

    renderComponent(<ProposalComp />, {
      accountAddress: fakeAccountAddress,
      chainId: executableRemoteProposal.chainId,
    });

    const executeButton = screen
      .getAllByText(en.voteProposalUi.command.actionButton.execute)[0]
      .closest('button');
    expect(executeButton).toBeInTheDocument();

    fireEvent.click(executeButton!);

    await waitFor(() => expect(executeMock).toHaveBeenCalledTimes(1));
    expect(executeMock).toHaveBeenCalledWith({
      chainId: executableRemoteProposal.chainId,
      proposalId: executableRemoteProposal.remoteProposalId,
    });
  });

  it('renders description correctly', async () => {
    renderComponent(<ProposalComp />);

    expect(screen.getByTestId(TEST_IDS.description).textContent).toMatchSnapshot();
  });

  describe('when running in Safe Wallet app', () => {
    beforeEach(() => {
      config.isSafeApp = true;
    });

    afterEach(() => {
      config.isSafeApp = false;
    });

    it('renders warning about voting being disabled but does not show switch button when running in Safe Wallet app', async () => {
      (useIsFeatureEnabled as Mock).mockImplementation(() => true);

      renderComponent(<ProposalComp />, {
        accountAddress: fakeAccountAddress,
        accountChainId: ChainId.ARBITRUM_SEPOLIA,
      });

      await waitFor(() => expect(screen.getByTestId(TEST_IDS.votingDisabledWarning)).toBeVisible());
      expect(screen.queryByText(en.vote.omnichain.switchToBnb)).not.toBeInTheDocument();
    });
  });
});
