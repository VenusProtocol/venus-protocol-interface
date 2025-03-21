import type { NonBscProposalFragment } from 'clients/subgraph/gql/generated/governanceNonBsc';
import { PROPOSAL_EXECUTION_GRACE_PERIOD_MS } from 'constants/governance';
import { CHAIN_IDS_ON_LAYER_ZERO } from 'constants/layerZero';
import { ProposalState, type RemoteProposal, RemoteProposalState } from 'types';
import { convertToDate } from 'utilities';
import type { ByteArray, Hex } from 'viem';
import { formatToProposalActions } from '../formatToProposalActions';
import { getRemoteProposalState } from './getRemoteProposalState';

export const formatToRemoteProposal = ({
  proposalState,
  proposalCanceledDate,
  proposalExpiredDate,
  proposalEndDate,
  proposalId,
  layerZeroChainId,
  gqlRemoteProposal,
  bridgedTimestampSeconds,
  failedTimestampSeconds,
  failedTxHash,
  withdrawnTimestampSeconds,
  withdrawnTxHash,
  callDatas,
  signatures,
  targets,
  values,
}: {
  proposalState: ProposalState;
  layerZeroChainId: number;
  proposalId: number;
  callDatas: (Hex | ByteArray)[];
  signatures: string[];
  targets: string[];
  values: string[];
  proposalCanceledDate?: Date;
  proposalExpiredDate?: Date;
  proposalEndDate?: Date;
  failedTimestampSeconds?: number;
  failedTxHash?: string;
  bridgedTimestampSeconds?: number;
  withdrawnTimestampSeconds?: number;
  withdrawnTxHash?: string;
  gqlRemoteProposal?: NonBscProposalFragment;
}) => {
  const chainId = CHAIN_IDS_ON_LAYER_ZERO[layerZeroChainId];

  let canceledDate: Date | undefined;
  let failedDate: Date | undefined;
  let canceledTxHash: string | undefined;

  if (gqlRemoteProposal?.canceled?.timestamp) {
    canceledDate = convertToDate({
      timestampSeconds: Number(gqlRemoteProposal?.canceled?.timestamp),
    });
    canceledTxHash = gqlRemoteProposal.canceled.txHash;
  } else if (failedTimestampSeconds) {
    failedDate = convertToDate({
      timestampSeconds: Number(failedTimestampSeconds),
    });
  } else if (withdrawnTimestampSeconds) {
    canceledDate = convertToDate({
      timestampSeconds: Number(withdrawnTimestampSeconds),
    });
    canceledTxHash = withdrawnTxHash;
  } else if (
    proposalState === ProposalState.Canceled ||
    proposalState === ProposalState.Expired ||
    proposalState === ProposalState.Defeated
  ) {
    canceledDate = proposalCanceledDate || proposalExpiredDate || proposalEndDate;
  }

  const executionEtaDate = gqlRemoteProposal?.executionEta
    ? convertToDate({
        timestampSeconds: Number(gqlRemoteProposal.executionEta),
      })
    : undefined;

  const state = getRemoteProposalState({
    proposalState,
    isRemoteProposalFailed: !!failedTimestampSeconds,
    isRemoteProposalBridged: !!bridgedTimestampSeconds,
    isRemoteProposalQueued: !!gqlRemoteProposal?.queued?.timestamp,
    isRemoteProposalExecuted: !!gqlRemoteProposal?.executed?.timestamp,
    isRemoteProposalCanceled: !!canceledDate,
    remoteProposalExecutionEtaDate: executionEtaDate,
  });

  const expiredDate =
    state === RemoteProposalState.Expired && executionEtaDate
      ? new Date(executionEtaDate.getTime() + PROPOSAL_EXECUTION_GRACE_PERIOD_MS)
      : undefined;

  const remoteProposal: RemoteProposal = {
    proposalId,
    remoteProposalId: gqlRemoteProposal && Number(gqlRemoteProposal.proposalId),
    chainId,
    proposalActions: formatToProposalActions({
      callDatas,
      signatures,
      targets,
      values,
    }),
    canceledDate,
    canceledTxHash,
    failedDate,
    failedTxHash,
    bridgedDate: bridgedTimestampSeconds
      ? convertToDate({ timestampSeconds: bridgedTimestampSeconds })
      : undefined,
    queuedDate: gqlRemoteProposal?.queued?.timestamp
      ? convertToDate({
          timestampSeconds: Number(gqlRemoteProposal.queued.timestamp),
        })
      : undefined,
    queuedTxHash: gqlRemoteProposal?.queued?.txHash,
    executionEtaDate,
    executedDate: gqlRemoteProposal?.executed?.timestamp
      ? convertToDate({
          timestampSeconds: Number(gqlRemoteProposal.executed.timestamp),
        })
      : undefined,
    executedTxHash: gqlRemoteProposal?.executed?.txHash,
    expiredDate,
    state,
  };

  return remoteProposal;
};
