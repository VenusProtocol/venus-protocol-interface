import { chainMetadata } from '@venusprotocol/chains';
import { useIsProposalExecutable } from 'hooks/useIsProposalExecutable';
import { useTranslation } from 'libs/translations';
import { governanceChain, useChainId } from 'libs/wallet';
import { useAccountAddress } from 'libs/wallet';
import { useMemo } from 'react';
import { type Proposal, ProposalState } from 'types';
import { Command } from '../Command';
import { Description } from '../Description';
import { useIsProposalCancelableByUser } from '../useIsProposalCancelableByUser';
import { ActionButton } from './ActionButton';
import { CurrentStep } from './CurrentStep';

const governanceChainMetadata = chainMetadata[governanceChain.id];

export interface BscCommandProps extends React.HTMLAttributes<HTMLDivElement> {
  proposal: Proposal;
}

export const BscCommand: React.FC<BscCommandProps> = ({ proposal, ...otherProps }) => {
  const { t } = useTranslation();
  const { chainId: currentChainId } = useChainId();
  const { accountAddress } = useAccountAddress();

  const isOnWrongChain = currentChainId !== governanceChain.id;

  const { isExecutable } = useIsProposalExecutable({
    isQueued: proposal.state === ProposalState.Queued,
    executionEtaDate: proposal.executionEtaDate,
  });

  const { isCancelable } = useIsProposalCancelableByUser({
    state: proposal.state,
    proposerAddress: proposal.proposerAddress,
    accountAddress,
  });

  const isQueueable = proposal.state === ProposalState.Succeeded;

  const isActionable = isCancelable || isQueueable || isExecutable;

  const description = useMemo(() => {
    switch (proposal.state) {
      case ProposalState.Pending:
        return t('voteProposalUi.command.description.pendingBsc');
      case ProposalState.Canceled:
        return t('voteProposalUi.command.description.canceled');
      case ProposalState.Queued:
        if (!isExecutable) {
          return t('voteProposalUi.command.description.waitingToBeExecutable');
        }

        if (isOnWrongChain) {
          return t('voteProposalUi.command.description.wrongChain', {
            chainName: governanceChainMetadata.name,
          });
        }
        break;
    }
  }, [t, proposal.state, isExecutable, isOnWrongChain]);

  return (
    <Command
      chainId={governanceChain.id}
      description={
        description ? (
          <Description type={isExecutable && isOnWrongChain ? 'warning' : 'info'}>
            {description}
          </Description>
        ) : undefined
      }
      proposalActions={proposal.proposalActions}
      contentRightItem={
        isActionable ? (
          <ActionButton
            className="hidden lg:block"
            proposalId={proposal.proposalId}
            state={proposal.state}
            executionEtaDate={proposal.executionEtaDate}
            proposerAddress={proposal.proposerAddress}
          />
        ) : (
          <CurrentStep proposal={proposal} />
        )
      }
      contentBottomItem={
        isActionable ? (
          <ActionButton
            className="mt-3 w-full lg:hidden"
            proposalId={proposal.proposalId}
            state={proposal.state}
            executionEtaDate={proposal.executionEtaDate}
            proposerAddress={proposal.proposerAddress}
          />
        ) : undefined
      }
      {...otherProps}
    />
  );
};
