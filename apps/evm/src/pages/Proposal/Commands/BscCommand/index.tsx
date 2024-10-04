import { CHAIN_METADATA } from 'constants/chainMetadata';
import { useTranslation } from 'libs/translations';
import { governanceChain, useChainId } from 'libs/wallet';
import { useAccountAddress } from 'libs/wallet';
import { useMemo } from 'react';
import { type Proposal, ProposalState } from 'types';
import { Command, type CommandProps } from '../Command';
import { Description } from '../Description';
import { useIsProposalCancelableByUser } from '../useIsProposalCancelableByUser';
import { useIsProposalExecutable } from '../useIsProposalExecutable';
import { ActionButton } from './ActionButton';
import { CurrentStep } from './CurrentStep';

const governanceChainMetadata = CHAIN_METADATA[governanceChain.id];

export type BscCommandProps = Omit<
  CommandProps,
  'contentRightItem' | 'contentBottomItem' | 'description' | 'chainId'
> &
  Pick<
    Proposal,
    | 'proposalId'
    | 'state'
    | 'executionEtaDate'
    | 'proposerAddress'
    | 'startDate'
    | 'endDate'
    | 'createdDate'
    | 'cancelDate'
    | 'queuedDate'
    | 'executedDate'
    | 'expiredDate'
  >;

export const BscCommand: React.FC<BscCommandProps> = ({
  proposalId,
  state,
  executionEtaDate,
  proposerAddress,
  startDate,
  endDate,
  createdDate,
  cancelDate,
  queuedDate,
  executedDate,
  expiredDate,
  ...otherProps
}) => {
  const { t } = useTranslation();
  const { chainId: currentChainId } = useChainId();
  const { accountAddress } = useAccountAddress();

  const isOnWrongChain = currentChainId !== governanceChain.id;

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

  const isActionable = isCancelable || isQueueable || isExecutable;

  const description = useMemo(() => {
    switch (state) {
      case ProposalState.Pending:
        return t('voteProposalUi.command.description.pending');
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
  }, [t, state, isExecutable, isOnWrongChain]);

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
      contentRightItem={
        isActionable ? (
          <ActionButton
            proposalId={proposalId}
            className="hidden lg:block"
            state={state}
            executionEtaDate={executionEtaDate}
            proposerAddress={proposerAddress}
          />
        ) : (
          <CurrentStep
            state={state}
            startDate={startDate}
            endDate={endDate}
            createdDate={createdDate}
            cancelDate={cancelDate}
            queuedDate={queuedDate}
            executedDate={executedDate}
            executionEtaDate={executionEtaDate}
            expiredDate={expiredDate}
          />
        )
      }
      contentBottomItem={
        isActionable ? (
          <ActionButton
            proposalId={proposalId}
            className="mt-3 w-full lg:hidden"
            state={state}
            executionEtaDate={executionEtaDate}
            proposerAddress={proposerAddress}
          />
        ) : undefined
      }
      {...otherProps}
    />
  );
};
