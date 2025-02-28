import { chainMetadata } from '@venusprotocol/chains';
import { Notice } from 'components';

import { TextButton } from 'components/Button';
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
  const targetChain = chainMetadata[targetChainId];

  const { switchChain } = useSwitchChain();
  const { t } = useTranslation();

  const handleSwitchChain = () => switchChain({ chainId: targetChainId });

  const shouldShow = isUserConnected && isOnWrongChain;

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
