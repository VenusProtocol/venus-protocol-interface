import { Button } from 'components';
import { CHAIN_METADATA } from 'constants/chainMetadata';
import { useTranslation } from 'libs/translations';
import { useSwitchChain } from 'libs/wallet';
import { useMemo } from 'react';
import type { ProposalCommand } from 'types';
import { useCommand } from '../useCommand';

export type CtaProps = Omit<React.HTMLAttributes<HTMLButtonElement>, 'onClick'> &
  Pick<
    ProposalCommand,
    | 'chainId'
    | 'state'
    | 'failedExecutionAt'
    | 'canceledAt'
    | 'bridgedAt'
    | 'queuedAt'
    | 'succeededAt'
    | 'executableAt'
    | 'executedAt'
    | 'expiredAt'
  >;

export const Cta: React.FC<CtaProps> = ({
  chainId,
  state,
  failedExecutionAt,
  canceledAt,
  bridgedAt,
  queuedAt,
  executableAt,
  executedAt,
  expiredAt,
  ...otherProps
}) => {
  const { t } = useTranslation();
  const chainMetadata = CHAIN_METADATA[chainId];

  const { isOnWrongChain, hasFailedExecution } = useCommand({
    chainId,
    state,
    executableAt,
    failedExecutionAt,
    executedAt,
  });

  const { switchChain } = useSwitchChain();

  // TODO: wire up (see VEN-2701)
  const execute = () => {};
  const retry = () => {};

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (isOnWrongChain) {
      return switchChain({ chainId });
    }

    if (hasFailedExecution) {
      return retry();
    }

    return execute();
  };

  const buttonLabel = useMemo(() => {
    if (isOnWrongChain) {
      return t('voteProposalUi.command.cta.wrongChain', {
        chainName: chainMetadata.name,
      });
    }

    if (hasFailedExecution) {
      return t('voteProposalUi.command.cta.retry');
    }

    return t('voteProposalUi.command.cta.execute');
  }, [t, isOnWrongChain, hasFailedExecution, chainMetadata.name]);

  return (
    <Button onClick={onClick} {...otherProps}>
      {buttonLabel}
    </Button>
  );
};
