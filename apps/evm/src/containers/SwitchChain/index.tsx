import { chainMetadata } from '@venusprotocol/chains';

import { Button } from 'components';
import { useTranslation } from 'libs/translations';
import { useAccountAddress, useAccountChainId, useChainId, useSwitchChain } from 'libs/wallet';
import type { ChainId } from 'types';

export interface SwitchChainProps extends React.HTMLAttributes<HTMLDivElement> {
  chainId?: ChainId;
}

export const SwitchChain: React.FC<SwitchChainProps> = ({ children, chainId, ...otherProps }) => {
  const { accountAddress } = useAccountAddress();
  const isUserConnected = !!accountAddress;

  const { chainId: currentChainId } = useChainId();
  const targetChainId = chainId || currentChainId;

  const { chainId: accountChainId } = useAccountChainId();
  const isOnWrongChain = accountChainId !== targetChainId || currentChainId !== targetChainId;
  const targetChain = chainMetadata[targetChainId];

  const { switchChain } = useSwitchChain();
  const { t } = useTranslation();

  const handleSwitchChain = () => switchChain({ chainId: targetChainId });

  return (
    <div {...otherProps}>
      {isUserConnected && isOnWrongChain ? (
        <Button className="w-full" onClick={handleSwitchChain}>
          {t('switchChain.switchButton', {
            chainName: targetChain.name,
          })}
        </Button>
      ) : (
        children
      )}
    </div>
  );
};
