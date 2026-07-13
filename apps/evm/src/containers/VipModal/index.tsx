import { Suspense } from 'react';

import { useIsConnectedAccountVip } from 'hooks/useIsConnectedAccountVip';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
import { useAccountAddress } from 'libs/wallet';
import { safeLazyLoad } from 'utilities';

const Modal = safeLazyLoad(() => import('./Modal'));

const VipModal: React.FC = () => {
  const { accountAddress } = useAccountAddress();
  const [userChainSettings] = useUserChainSettings();
  const { isConnectedAccountVip } = useIsConnectedAccountVip();

  if (!accountAddress || !isConnectedAccountVip || userChainSettings.doNotShowVipModal) {
    return undefined;
  }

  return (
    <Suspense>
      <Modal />
    </Suspense>
  );
};

export default VipModal;
