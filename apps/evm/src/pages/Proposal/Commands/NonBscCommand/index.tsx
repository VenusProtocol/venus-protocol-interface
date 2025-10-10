import { chains } from '@venusprotocol/chains';
import { useIsProposalExecutable } from 'hooks/useIsProposalExecutable';
import { useTranslation } from 'libs/translations';
import { governanceChain, useChainId } from 'libs/wallet';
import { useMemo } from 'react';
import { type RemoteProposal, RemoteProposalState } from 'types';
import { Command } from '../Command';
import { Description } from '../Description';
import { CurrentStep } from './CurrentStep';
import { ExecuteButton } from './ExecuteButton';

const governanceChainMetadata = chains[governanceChain.id];

export interface NonBscCommand extends React.HTMLAttributes<HTMLDivElement> {
  remoteProposal: RemoteProposal;
  proposalExecutedTxHash?: string;
}

export const NonBscCommand: React.FC<NonBscCommand> = ({
  proposalExecutedTxHash,
  remoteProposal,
  ...otherProps
}) => {
  const { t } = useTranslation();
  const { chainId: currentChainId } = useChainId();

  const chain = chains[remoteProposal.chainId];
  const isOnWrongChain = currentChainId !== remoteProposal.chainId;

  const { isExecutable } = useIsProposalExecutable({
    isQueued: remoteProposal.state === RemoteProposalState.Queued,
    executionEtaDate: remoteProposal.executionEtaDate,
  });

  const description = useMemo(() => {
    switch (remoteProposal.state) {
      case RemoteProposalState.Pending:
        return t('voteProposalUi.command.description.pending', {
          chainName: governanceChainMetadata.name,
        });
      case RemoteProposalState.Bridged:
        return t('voteProposalUi.command.description.bridged');
      case RemoteProposalState.Failed:
        return t('voteProposalUi.command.description.failed');
      case RemoteProposalState.Canceled:
        return t('voteProposalUi.command.description.canceled');
      case RemoteProposalState.Queued:
        if (!isExecutable) {
          return t('voteProposalUi.command.description.waitingToBeExecutable');
        }

        if (isOnWrongChain) {
          return t('voteProposalUi.command.description.wrongChain', {
            chainName: chain.name,
          });
        }
        break;
    }
  }, [t, remoteProposal.state, chain, isOnWrongChain, isExecutable]);

  return (
    <Command
      chainId={remoteProposal.chainId}
      description={
        description ? (
          <Description type={isExecutable && isOnWrongChain ? 'warning' : 'info'}>
            {description}
          </Description>
        ) : undefined
      }
      proposalActions={remoteProposal.proposalActions}
      contentRightItem={
        isExecutable && remoteProposal.remoteProposalId ? (
          <ExecuteButton
            className="hidden lg:block"
            remoteProposalChainId={remoteProposal.chainId}
            remoteProposalId={remoteProposal.remoteProposalId}
          />
        ) : (
          <CurrentStep
            proposalExecutedTxHash={proposalExecutedTxHash}
            remoteProposal={remoteProposal}
          />
        )
      }
      contentBottomItem={
        isExecutable && remoteProposal.remoteProposalId ? (
          <ExecuteButton
            className="mt-3 w-full lg:hidden"
            remoteProposalChainId={remoteProposal.chainId}
            remoteProposalId={remoteProposal.remoteProposalId}
          />
        ) : undefined
      }
      {...otherProps}
    />
  );
};
