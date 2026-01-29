import { chains } from '@venusprotocol/chains';
import { type ButtonProps, cn } from '@venusprotocol/ui';

import { Button } from 'components';
import { useTranslation } from 'libs/translations';
import { useAccountAddress, useAccountChainId, useChainId, useSwitchChain } from 'libs/wallet';
import type { ChainId } from 'types';

export interface SwitchChainProps extends React.HTMLAttributes<HTMLDivElement> {
  buttonClassName?: string;
  buttonVariant?: ButtonProps['variant'];
  small?: boolean;
  chainId?: ChainId;
}

export const SwitchChain: React.FC<SwitchChainProps> = ({
  children,
  chainId,
  buttonClassName,
  buttonVariant,
  small,
  ...otherProps
}) => {
  const { accountAddress } = useAccountAddress();
  const isUserConnected = !!accountAddress;

  const { chainId: currentChainId } = useChainId();
  const targetChainId = chainId || currentChainId;

  const { chainId: accountChainId } = useAccountChainId();
  const isOnWrongChain = accountChainId !== targetChainId || currentChainId !== targetChainId;
  const targetChain = chains[targetChainId];

  const { switchChain } = useSwitchChain();
  const { t } = useTranslation();

  const handleSwitchChain = () => switchChain({ chainId: targetChainId });

  return (
    <div {...otherProps}>
      {isUserConnected && isOnWrongChain ? (
        <Button
          className={cn('w-full', buttonClassName)}
          onClick={handleSwitchChain}
          variant={buttonVariant}
          size={small ? 'xs' : 'md'}
        >
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
