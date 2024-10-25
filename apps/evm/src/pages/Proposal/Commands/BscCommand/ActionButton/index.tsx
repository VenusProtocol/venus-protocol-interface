import { useCancelProposal, useExecuteProposal, useQueueProposal } from 'clients/api';
import { Button } from 'components';
import type { ConnectWalletProps } from 'containers/ConnectWallet';
import { ConnectWallet } from 'containers/ConnectWallet';
import { displayMutationError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import { governanceChain, useAccountAddress } from 'libs/wallet';
import { useMemo } from 'react';
import { ProposalState } from 'types';
import { cn } from 'utilities';
import { useIsProposalCancelableByUser } from '../../useIsProposalCancelableByUser';
import { useIsProposalExecutable } from '../../useIsProposalExecutable';

export interface ActionButtonProps extends Omit<ConnectWalletProps, 'onClick'> {
  proposalId: number;
  proposerAddress: string;
  state: ProposalState;
  executionEtaDate?: Date;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  state,
  proposalId,
  proposerAddress,
  executionEtaDate,
  className,
  ...otherProps
}) => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();

  const { isExecutable } = useIsProposalExecutable({
    isQueued: state === ProposalState.Queued,
    executionEtaDate,
  });

  const { isCancelable } = useIsProposalCancelableByUser({
    state,
    proposerAddress,
    accountAddress,
  });

  const isQueueable = state === ProposalState.Succeeded;

  const { mutateAsync: cancelProposal, isPending: isCancelProposalLoading } = useCancelProposal();
  const { mutateAsync: executeProposal, isPending: isExecuteProposalLoading } =
    useExecuteProposal();
  const { mutateAsync: queueProposal, isPending: isQueueProposalLoading } = useQueueProposal();

  const buttonDom = useMemo(() => {
    if (isCancelable) {
      const cancel = async () => {
        try {
          await cancelProposal({ proposalId });
        } catch (error) {
          displayMutationError({ error });
        }
      };

      return (
        <Button variant="secondary" onClick={cancel} disabled={isCancelProposalLoading}>
          {t('voteProposalUi.command.actionButton.cancel')}
        </Button>
      );
    }

    if (isQueueable) {
      const queue = async () => {
        try {
          await queueProposal({ proposalId });
        } catch (error) {
          displayMutationError({ error });
        }
      };

      return (
        <Button onClick={queue} disabled={isQueueProposalLoading}>
          {t('voteProposalUi.command.actionButton.queue')}
        </Button>
      );
    }

    if (isExecutable) {
      const execute = async () => {
        try {
          await executeProposal({ proposalId });
        } catch (error) {
          displayMutationError({ error });
        }
      };

      return (
        <Button onClick={execute} disabled={isExecuteProposalLoading}>
          {t('voteProposalUi.command.actionButton.execute')}
        </Button>
      );
    }
  }, [
    t,
    proposalId,
    isCancelable,
    isQueueable,
    isExecutable,
    cancelProposal,
    queueProposal,
    executeProposal,
    isCancelProposalLoading,
    isExecuteProposalLoading,
    isQueueProposalLoading,
  ]);

  return (
    <ConnectWallet chainId={governanceChain.id} className={cn('w-auto', className)} {...otherProps}>
      {buttonDom}
    </ConnectWallet>
  );
};
