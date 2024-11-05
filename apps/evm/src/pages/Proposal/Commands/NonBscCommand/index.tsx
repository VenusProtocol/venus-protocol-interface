import { Button } from 'components';
import { CHAIN_METADATA } from 'constants/chainMetadata';
import { ConnectWallet } from 'containers/ConnectWallet';
import { isAfter } from 'date-fns/isAfter';
import { useNow } from 'hooks/useNow';
import { useTranslation } from 'libs/translations';
import { useChainId } from 'libs/wallet';
import { useMemo } from 'react';
import { type RemoteProposal, RemoteProposalState } from 'types';
import { Command, type CommandProps } from '../Command';
import { Description } from '../Description';
import { useIsProposalExecutable } from '../useIsProposalExecutable';
import { CurrentStep } from './CurrentStep';

export type NonBscCommand = Omit<
  CommandProps,
  'contentRightItem' | 'contentBottomItem' | 'description'
> &
  Pick<
    RemoteProposal,
    | 'state'
    | 'executionEtaDate'
    | 'bridgedDate'
    | 'canceledDate'
    | 'queuedDate'
    | 'executedDate'
    | 'expiredDate'
  >;

export const NonBscCommand: React.FC<NonBscCommand> = ({
  chainId,
  state,
  executionEtaDate,
  bridgedDate,
  canceledDate,
  queuedDate,
  executedDate,
  expiredDate,
  ...otherProps
}) => {
  const { t } = useTranslation();
  const now = useNow();
  const { chainId: currentChainId } = useChainId();

  const chainMetadata = CHAIN_METADATA[chainId];

  const isOnWrongChain = currentChainId !== chainId;

  const { isExecutable } = useIsProposalExecutable({
    isQueued: state === RemoteProposalState.Queued,
    executionEtaDate,
  });

  // TODO: wire up (see VEN-2701)
  const execute = () => {};

  const description = useMemo(() => {
    switch (state) {
      case RemoteProposalState.Pending:
        return t('voteProposalUi.command.description.pending');
      case RemoteProposalState.Bridged:
        return t('voteProposalUi.command.description.bridged');
      case RemoteProposalState.Canceled:
        return t('voteProposalUi.command.description.canceled');
      case RemoteProposalState.Queued:
        if (!executionEtaDate || isAfter(executionEtaDate, now)) {
          return t('voteProposalUi.command.description.waitingToBeExecutable');
        }

        if (isOnWrongChain) {
          return t('voteProposalUi.command.description.wrongChain', {
            chainName: chainMetadata.name,
          });
        }
        break;
    }
  }, [t, state, executionEtaDate, now, chainMetadata, isOnWrongChain]);

  return (
    <Command
      chainId={chainId}
      description={
        description ? (
          <Description type={isExecutable && isOnWrongChain ? 'warning' : 'info'}>
            {description}
          </Description>
        ) : undefined
      }
      contentRightItem={
        isExecutable && executionEtaDate ? (
          <ConnectWallet chainId={chainId} className="hidden lg:block w-auto">
            <Button onClick={execute}>{t('voteProposalUi.command.cta.execute')}</Button>
          </ConnectWallet>
        ) : (
          <CurrentStep
            className="cursor-pointer"
            chainId={chainId}
            state={state}
            bridgedDate={bridgedDate}
            canceledDate={canceledDate}
            queuedDate={queuedDate}
            executionEtaDate={executionEtaDate}
            executedDate={executedDate}
            expiredDate={expiredDate}
          />
        )
      }
      contentBottomItem={
        isExecutable && executionEtaDate ? (
          <ConnectWallet chainId={chainId} className="mt-3 w-full lg:hidden">
            <Button onClick={execute}>{t('voteProposalUi.command.cta.execute')}</Button>
          </ConnectWallet>
        ) : undefined
      }
      {...otherProps}
    />
  );
};
