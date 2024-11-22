import { fireEvent, screen, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';

import fakeAccountAddress from '__mocks__/models/address';
import { proposals } from '__mocks__/models/proposals';
import {
  useCancelProposal,
  useExecuteProposal,
  useGetCurrentVotes,
  useGetProposal,
  useGetProposalThreshold,
  useQueueProposal,
} from 'clients/api';
import { type UseIsFeatureEnabled, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useNow } from 'hooks/useNow';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import {
  ChainId,
  type Proposal,
  ProposalState,
  type RemoteProposal,
  RemoteProposalState,
} from 'types';
import type Vi from 'vitest';
import ProposalUi from '..';
import TEST_IDS from '../testIds';

vi.mock('hooks/useNow');
vi.mock('hooks/useVote');
vi.mock('hooks/useIsFeatureEnabled');

const proposal = proposals[0];
const remoteProposal: RemoteProposal = {
  proposalId: 1,
  remoteProposalId: 1,
  chainId: ChainId.BSC_TESTNET,
  state: RemoteProposalState.Pending,
  proposalActions: [],
};

const activeProposal = proposals[1];
const succeededProposal = proposals[4];
const queuedProposal = proposals[5];

const fakeNow = new Date(
  activeProposal.endDate!.setMinutes(activeProposal.endDate!.getMinutes() - 5),
);

describe('ProposalUi page - Feature enabled: omnichainGovernance', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(fakeNow);

    (useNow as Vi.Mock).mockImplementation(() => fakeNow);

    (useGetProposal as Vi.Mock).mockImplementation(() => ({
      data: {
        proposal: activeProposal,
      },
    }));

    (useIsFeatureEnabled as Vi.Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabled) => name === 'omnichainGovernance',
    );
  });

  it('renders without crashing', async () => {
    renderComponent(<ProposalUi />);
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
  ])('renders BSC command correctly. Proposal state: $state', async proposal => {
    (useGetProposal as Vi.Mock).mockImplementation(() => ({
      data: {
        proposal,
      },
    }));

    renderComponent(<ProposalUi />, {
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
  ])('renders remote commands correctly. Remote proposal state: $state', async remoteProposal => {
    const customProposal: Proposal = {
      ...proposal,
      state: ProposalState.Executed,
      executedDate: fakeNow,
      remoteProposals: [remoteProposal],
    };

    (useGetProposal as Vi.Mock).mockImplementation(() => ({
      data: {
        proposal: customProposal,
      },
    }));

    renderComponent(<ProposalUi />);

    expect(screen.getByTestId(TEST_IDS.commands).textContent).toMatchSnapshot();
  });

  it('lets user cancel their own BSC proposal', async () => {
    const cancelMock = vi.fn();
    (useCancelProposal as Vi.Mock).mockImplementation(() => ({
      mutateAsync: cancelMock,
    }));

    renderComponent(<ProposalUi />, {
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

    (useGetProposalThreshold as Vi.Mock).mockImplementation(() => ({
      data: {
        thresholdMantissa: new BigNumber(FAKE_THRESHOLD_MANTISSA),
      },
    }));

    (useGetCurrentVotes as Vi.Mock).mockImplementation(() => ({
      data: {
        votesMantissa: new BigNumber(FAKE_THRESHOLD_MANTISSA - 1),
      },
    }));

    const cancelMock = vi.fn();
    (useCancelProposal as Vi.Mock).mockImplementation(() => ({
      mutateAsync: cancelMock,
    }));

    renderComponent(<ProposalUi />, {
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

  it('does not let user cancel if the BSC proposal if voting power of the proposer is greater than or equals threshold', async () => {
    const cancelMock = vi.fn();
    (useCancelProposal as Vi.Mock).mockImplementation(() => ({
      mutateAsync: cancelMock,
    }));

    renderComponent(<ProposalUi />, {
      accountAddress: fakeAccountAddress,
    });

    expect(
      screen.queryByText(en.voteProposalUi.command.actionButton.cancel),
    ).not.toBeInTheDocument();
  });

  it('does not let user cancel the BSC proposal if it has passed the succeeded state', async () => {
    (useGetProposal as Vi.Mock).mockImplementation(() => ({
      data: {
        proposal: succeededProposal,
      },
    }));

    const cancelMock = vi.fn();
    (useCancelProposal as Vi.Mock).mockImplementation(() => ({
      mutateAsync: cancelMock,
    }));

    renderComponent(<ProposalUi />, {
      accountAddress: activeProposal.proposerAddress,
    });

    expect(
      screen.queryByText(en.voteProposalUi.command.actionButton.cancel),
    ).not.toBeInTheDocument();
  });

  it('lets user queue the BSC proposal', async () => {
    (useGetProposal as Vi.Mock).mockImplementation(() => ({
      data: {
        proposal: succeededProposal,
      },
    }));

    const queueMock = vi.fn();
    (useQueueProposal as Vi.Mock).mockImplementation(() => ({
      mutateAsync: queueMock,
    }));

    renderComponent(<ProposalUi />, {
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
    (useGetProposal as Vi.Mock).mockImplementation(() => ({
      data: {
        proposal: succeededProposal,
      },
    }));

    const queueMock = vi.fn();
    (useQueueProposal as Vi.Mock).mockImplementation(() => ({
      mutateAsync: queueMock,
    }));

    renderComponent(<ProposalUi />, {
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

    (useGetProposal as Vi.Mock).mockImplementation(() => ({
      data: {
        proposal: customProposal,
      },
    }));

    const executeMock = vi.fn();
    (useExecuteProposal as Vi.Mock).mockImplementation(() => ({
      mutateAsync: executeMock,
    }));

    renderComponent(<ProposalUi />, {
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

    (useGetProposal as Vi.Mock).mockImplementation(() => ({
      data: {
        proposal: executedProposal,
      },
    }));

    const executeMock = vi.fn();
    (useExecuteProposal as Vi.Mock).mockImplementation(() => ({
      mutateAsync: executeMock,
    }));

    renderComponent(<ProposalUi />, {
      accountAddress: fakeAccountAddress,
      chainId: executableRemoteProposal.chainId,
    });

    const executeButton = screen
      .getAllByText(en.voteProposalUi.command.cta.execute)[0]
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
    renderComponent(<ProposalUi />);

    expect(screen.getByTestId(TEST_IDS.description).textContent).toMatchSnapshot();
  });
});
