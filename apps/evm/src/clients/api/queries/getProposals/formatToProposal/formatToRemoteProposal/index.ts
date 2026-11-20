import { PROPOSAL_EXECUTION_GRACE_PERIOD_MS } from 'constants/governance';
import { CHAIN_IDS_ON_LAYER_ZERO } from 'constants/layerZero';
import { ProposalState, type RemoteProposal, RemoteProposalState } from 'types';
import { convertToDate } from 'utilities';
import type { ApiRemoteProposal } from '../../types';
import { formatToProposalActions } from '../formatToProposalActions';
import { getRemoteProposalState } from './getRemoteProposalState';

export const formatToRemoteProposal = ({
  proposalId,
  proposalState,
  proposalCanceledDate,
  proposalExpiredDate,
  proposalEndDate,
  apiRemoteProposal,
}: {
  proposalId: number;
  proposalState: ProposalState;
  apiRemoteProposal: ApiRemoteProposal;
  proposalCanceledDate?: Date;
  proposalExpiredDate?: Date;
  proposalEndDate?: Date;
}) => {
  const { layerZeroChainId, remoteProposalId, actions, stored, bridged, withdrawn, execution } =
    apiRemoteProposal;
  const chainId = CHAIN_IDS_ON_LAYER_ZERO[layerZeroChainId];

  let canceledDate: Date | undefined;
  let failedDate: Date | undefined;
  let canceledTxHash: string | undefined;

  if (execution?.canceled) {
    canceledDate = convertToDate({ timestampSeconds: execution.canceled.timestamp });
    canceledTxHash = execution.canceled.txHash;
  } else if (stored) {
    failedDate = convertToDate({ timestampSeconds: stored.timestamp });
  } else if (withdrawn) {
    canceledDate = convertToDate({ timestampSeconds: withdrawn.timestamp });
    canceledTxHash = withdrawn.txHash;
  } else if (
    proposalState === ProposalState.Canceled ||
    proposalState === ProposalState.Expired ||
    proposalState === ProposalState.Defeated
  ) {
    canceledDate = proposalCanceledDate || proposalExpiredDate || proposalEndDate;
  }

  const executionEtaDate = execution?.executionEta
    ? convertToDate({ timestampSeconds: execution.executionEta })
    : undefined;

  const state = getRemoteProposalState({
    proposalState,
    isRemoteProposalFailed: !!stored,
    isRemoteProposalBridged: !!bridged,
    isRemoteProposalQueued: !!execution?.queued,
    isRemoteProposalExecuted: !!execution?.executed,
    isRemoteProposalCanceled: !!canceledDate,
    remoteProposalExecutionEtaDate: executionEtaDate,
  });

  const expiredDate =
    state === RemoteProposalState.Expired && executionEtaDate
      ? new Date(executionEtaDate.getTime() + PROPOSAL_EXECUTION_GRACE_PERIOD_MS)
      : undefined;

  const remoteProposal: RemoteProposal = {
    proposalId,
    remoteProposalId: remoteProposalId ?? undefined,
    chainId,
    proposalActions: formatToProposalActions({ actions }),
    canceledDate,
    canceledTxHash,
    failedDate,
    failedTxHash: stored?.txHash,
    bridgedDate: bridged ? convertToDate({ timestampSeconds: bridged.timestamp }) : undefined,
    queuedDate: execution?.queued
      ? convertToDate({ timestampSeconds: execution.queued.timestamp })
      : undefined,
    queuedTxHash: execution?.queued?.txHash,
    executionEtaDate,
    executedDate: execution?.executed
      ? convertToDate({ timestampSeconds: execution.executed.timestamp })
      : undefined,
    executedTxHash: execution?.executed?.txHash,
    expiredDate,
    state,
  };

  return remoteProposal;
};
