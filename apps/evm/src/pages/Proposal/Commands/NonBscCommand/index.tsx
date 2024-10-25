import { useExecuteProposal } from 'clients/api';
import { Button } from 'components';
import { CHAIN_METADATA } from 'constants/chainMetadata';
import { ConnectWallet } from 'containers/ConnectWallet';
import { isAfter } from 'date-fns/isAfter';
import { useNow } from 'hooks/useNow';
import { VError, handleError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import { governanceChain, useChainId } from 'libs/wallet';
import { useMemo } from 'react';
import { type RemoteProposal, RemoteProposalState } from 'types';
import { Command } from '../Command';
import { Description } from '../Description';
import { useIsProposalExecutable } from '../useIsProposalExecutable';
import { CurrentStep } from './CurrentStep';

const governanceChainMetadata = CHAIN_METADATA[governanceChain.id];

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
  const now = useNow();
  const { chainId: currentChainId } = useChainId();

  const chainMetadata = CHAIN_METADATA[remoteProposal.chainId];

  const isOnWrongChain = currentChainId !== remoteProposal.chainId;

  const { isExecutable } = useIsProposalExecutable({
    isQueued: remoteProposal.state === RemoteProposalState.Queued,
    executionEtaDate: remoteProposal.executionEtaDate,
  });

  const { mutateAsync: executeProposal, isPending: isExecuteProposalLoading } =
    useExecuteProposal();

  const execute = async () => {
    if (!remoteProposal.remoteProposalId) {
      throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
    }

    try {
      await executeProposal({
        proposalId: remoteProposal.remoteProposalId,
        chainId: remoteProposal.chainId,
      });
    } catch (error) {
      handleError({ error });
    }
  };

  const description = useMemo(() => {
    switch (remoteProposal.state) {
      case RemoteProposalState.Pending:
        return t('voteProposalUi.command.description.pending', {
          chainName: governanceChainMetadata.name,
        });
      case RemoteProposalState.Bridged:
        return t('voteProposalUi.command.description.bridged');
      case RemoteProposalState.Canceled:
        return t('voteProposalUi.command.description.canceled');
      case RemoteProposalState.Queued:
        if (!remoteProposal.executionEtaDate || isAfter(remoteProposal.executionEtaDate, now)) {
          return t('voteProposalUi.command.description.waitingToBeExecutable');
        }

        if (isOnWrongChain) {
          return t('voteProposalUi.command.description.wrongChain', {
            chainName: chainMetadata.name,
          });
        }
        break;
    }
  }, [
    t,
    remoteProposal.state,
    remoteProposal.executionEtaDate,
    now,
    chainMetadata,
    isOnWrongChain,
  ]);

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
        isExecutable ? (
          <ConnectWallet chainId={remoteProposal.chainId} className="hidden lg:block w-auto">
            <Button onClick={execute} disabled={isExecuteProposalLoading}>
              {t('voteProposalUi.command.cta.execute')}
            </Button>
          </ConnectWallet>
        ) : (
          <CurrentStep
            proposalExecutedTxHash={proposalExecutedTxHash}
            remoteProposal={remoteProposal}
          />
        )
      }
      contentBottomItem={
        isExecutable ? (
          <ConnectWallet chainId={remoteProposal.chainId} className="mt-3 w-full lg:hidden">
            <Button onClick={execute}>{t('voteProposalUi.command.cta.execute')}</Button>
          </ConnectWallet>
        ) : undefined
      }
      {...otherProps}
    />
  );
};
