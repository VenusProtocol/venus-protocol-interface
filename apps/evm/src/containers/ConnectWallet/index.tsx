import { chainMetadata } from '@venusprotocol/registry';
import { useMemo } from 'react';

import { Button, type Variant } from 'components/Button';
import { NoticeInfo } from 'components/Notice';
import { useTranslation } from 'libs/translations';
import { useAccountAddress, useAuthModal, useChainId, useSwitchChain } from 'libs/wallet';
import type { ChainId } from 'types';
import { Container } from './Container';

export interface ConnectWalletProps extends React.HTMLAttributes<HTMLDivElement> {
  chainId?: ChainId;
  buttonVariant?: Variant;
  message?: string;
  className?: string;
  children?: React.ReactNode;
}

export const ConnectWallet: React.FC<ConnectWalletProps> = ({
  children,
  chainId,
  message,
  buttonVariant,
  ...otherProps
}) => {
  const { accountAddress } = useAccountAddress();
  const isUserConnected = !!accountAddress;

  const { chainId: currentChainId } = useChainId();

  const isOnWrongChain = useMemo(
    () => chainId && currentChainId !== chainId,
    [currentChainId, chainId],
  );

  const chain = chainId && chainMetadata[chainId];

  const { openAuthModal } = useAuthModal();
  const { switchChain } = useSwitchChain();
  const handleSwitchChain = () => chainId && switchChain({ chainId });

  const { t } = useTranslation();

  if (!isUserConnected) {
    return (
      <Container {...otherProps}>
        {!!message && <NoticeInfo className="mb-8" description={message} />}

        <Button variant={buttonVariant} className="w-full" onClick={openAuthModal}>
          {t('connectWallet.connectButton')}
        </Button>
      </Container>
    );
  }

  if (isOnWrongChain) {
    return (
      <Container {...otherProps}>
        <Button variant={buttonVariant} className="w-full" onClick={handleSwitchChain}>
          {t('connectWallet.switchChain', {
            chainName: chain?.name,
          })}
        </Button>
      </Container>
    );
  }

  return <Container {...otherProps}>{children}</Container>;
};
