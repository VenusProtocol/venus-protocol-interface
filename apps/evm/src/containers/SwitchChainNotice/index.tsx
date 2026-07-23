import { chains } from '@venusprotocol/chains';
import { useEffect } from 'react';

import { Notice, TextButton } from 'components';
import { useTranslation } from 'libs/translations';
import { useAccountAddress, useAccountChainId, useChainId, useSwitchChain } from 'libs/wallet';
import type { ChainId } from 'types';

export interface SwitchChainNoticeProps extends React.HTMLAttributes<HTMLDivElement> {
  chainId?: ChainId;
}

export const SwitchChainNotice: React.FC<SwitchChainNoticeProps> = ({
  children,
  chainId,
  ...otherProps
}) => {
  const { accountAddress } = useAccountAddress();
  const isUserConnected = !!accountAddress;

  const { chainId: currentChainId } = useChainId();
  const targetChainId = chainId || currentChainId;

  const { chainId: accountChainId } = useAccountChainId();
  const isOnWrongChain = accountChainId !== targetChainId;
  const targetChain = chains[targetChainId];

  const { switchChain } = useSwitchChain();
  const { t } = useTranslation();

  const handleSwitchChain = () => switchChain({ chainId: targetChainId });

  const shouldShow = isUserConnected && isOnWrongChain;

  // Change-gated so it only logs on transitions, not on every render.
  useEffect(() => {
    console.log(
      `[CHAIN_DEBUG] SwitchChainNotice | currentChainId=${currentChainId} | targetChainId=${targetChainId} | accountChainId=${accountChainId} | shouldShow=${shouldShow}`,
    );
  }, [currentChainId, targetChainId, accountChainId, shouldShow]);

  if (!shouldShow) {
    return undefined;
  }

  return (
    <Notice
      title={t('switchChainNotice.description', {
        chainName: targetChain.name,
      })}
      description={
        <TextButton className="p-0 h-auto font-medium" onClick={handleSwitchChain}>
          {t('switchChainNotice.buttonLabel', {
            chainName: targetChain.name,
          })}
        </TextButton>
      }
      {...otherProps}
    />
  );
};
