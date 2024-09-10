import { Button } from 'components';
import { CHAIN_METADATA } from 'constants/chainMetadata';
import { useTranslation } from 'libs/translations';
import { useSwitchChain } from 'libs/wallet';
import { useMemo } from 'react';
import type { RemoteProposal } from 'types';
import { useCommand } from '../useCommand';

export type CtaProps = Omit<React.HTMLAttributes<HTMLButtonElement>, 'onClick'> &
  Pick<
    RemoteProposal,
    | 'chainId'
    | 'state'
    | 'canceledDate'
    | 'bridgedDate'
    | 'queuedDate'
    | 'executionEtaDate'
    | 'executedDate'
    | 'expiredDate'
  >;

export const Cta: React.FC<CtaProps> = ({
  chainId,
  state,
  canceledDate,
  bridgedDate,
  queuedDate,
  executionEtaDate,
  executedDate,
  expiredDate,
  ...otherProps
}) => {
  const { t } = useTranslation();
  const chainMetadata = CHAIN_METADATA[chainId];

  const { isOnWrongChain } = useCommand({
    chainId,
    state,
    executionEtaDate,
  });

  const { switchChain } = useSwitchChain();

  // TODO: wire up (see VEN-2701)
  const execute = () => {};

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (isOnWrongChain) {
      return switchChain({ chainId });
    }

    return execute();
  };

  const buttonLabel = useMemo(() => {
    if (isOnWrongChain) {
      return t('voteProposalUi.command.cta.wrongChain', {
        chainName: chainMetadata.name,
      });
    }

    return t('voteProposalUi.command.cta.execute');
  }, [t, isOnWrongChain, chainMetadata.name]);

  return (
    <Button onClick={onClick} {...otherProps}>
      {buttonLabel}
    </Button>
  );
};
