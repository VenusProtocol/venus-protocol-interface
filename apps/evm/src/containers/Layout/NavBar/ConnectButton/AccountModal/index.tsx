import { Button } from '@venusprotocol/ui';
import { useLocation, useNavigate } from 'react-router';
import type { Address } from 'viem';
import { useDisconnect } from 'wagmi';

import { BodyBackdrop, Icon } from 'components';
import config from 'config';
import { routes } from 'constants/routing';
import { AccountOverview } from 'containers/AccountOverview';
import { CopyAddressButton } from 'containers/CopyAddressButton';
import { VipTelegramGroupButton } from 'containers/VipTelegramGroupButton';
import { useInterfaceMode } from 'hooks/useInterfaceMode';
import { useTranslation } from 'libs/translations';
import { ChainSelect } from '../../ChainSelect';
import { Settings } from '../../Settings';
import { UserButton } from '../UserButton';

export interface AccountModalProps {
  address: Address;
  isVip: boolean;
  isPrime: boolean;
  onClose?: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({ address, isVip, isPrime, onClose }) => {
  const { t } = useTranslation();
  const { isLite } = useInterfaceMode();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const { disconnect } = useDisconnect();

  const handleDisconnect = () => {
    disconnect();

    if (pathname === routes.dashboard.path) {
      navigate({ pathname: routes.landing.path, search });
    }

    onClose?.();
  };

  const handleViewDashboard = () => {
    navigate({ pathname: routes.dashboard.path, search });
    onClose?.();
  };

  return (
    <>
      <BodyBackdrop onClick={onClose} className="hidden sm:block" />

      <div className="fixed top-16 bottom-0 left-0 right-0 z-99999 min-w-full sm:relative sm:top-0">
        <div className="absolute inset-0 right-0 min-w-full sm:pt-7 sm:left-auto sm:top-auto sm:bottom-auto">
          <div className="w-full h-full bg-popover shadow-popup backdrop-blur-popup backdrop-saturate-[1.2] p-6 flex flex-col gap-y-6 overflow-auto sm:w-123 sm:overflow-visible sm:rounded-xl sm:border sm:border-raised">
            <div className="flex flex-col gap-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-x-2 md:gap-x-3">
                  {!isLite && (
                    <ChainSelect className="md:hidden" buttonClassName="h-12 px-3 py-0" />
                  )}

                  <UserButton
                    address={address}
                    isPrime={isPrime}
                    isVip={isVip}
                    disabled
                    className="h-12"
                  />

                  <CopyAddressButton className="shrink-0 text-secondary" address={address} />
                </div>

                <button
                  onClick={onClose}
                  type="button"
                  className="cursor-pointer text-secondary hover:text-secondary-hover"
                >
                  <Icon name="close" className="size-5 text-inherit transition-colors" />
                </button>
              </div>
            </div>

            <AccountOverview accountAddress={address} showGraph={false} />

            <div className="flex flex-col gap-y-3">
              <Settings />

              <Button variant="secondary" className="w-full min-h-12" onClick={handleViewDashboard}>
                {t('accountModal.dashboardButtonLabel')}
              </Button>

              {isVip && <VipTelegramGroupButton />}

              {/* When running in Safe Wallet app, user's wallet should be kept connected at all time */}
              {!config.isSafeApp && (
                <Button variant="secondary" onClick={handleDisconnect} className="w-full min-h-12">
                  <div className="flex items-center gap-x-2">
                    <Icon name="connect" className="size-5 text-inherit transition-colors" />

                    <span>{t('accountModal.disconnectButtonLabel')}</span>
                  </div>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
