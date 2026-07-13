import { Button } from '@venusprotocol/ui';
import type { Address } from 'viem';
import { useDisconnect } from 'wagmi';

import { BodyBackdrop, Icon } from 'components';
import config from 'config';
import { AccountOverview } from 'containers/AccountOverview';
import { CopyAddressButton } from 'containers/CopyAddressButton';
import { VipTelegramGroupButton } from 'containers/VipTelegramGroupButton';
import { useTranslation } from 'libs/translations';
import { ClaimRewardsButton } from '../../ClaimRewardsButton';
import { Settings } from '../../Settings';
import { UserButton } from '../UserButton';

export interface AccountModalProps {
  address: Address;
  isVip: boolean;
  isPrime: boolean;
  onClose?: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({ address, isVip, isPrime, onClose }) => {
  const { disconnect } = useDisconnect();
  const handleDisconnect = () => {
    disconnect();

    onClose?.();
  };

  const { t } = useTranslation();

  return (
    <>
      <BodyBackdrop onClick={onClose} className="hidden sm:block" />

      <div className="fixed top-20 bottom-0 left-0 right-0 z-99999 min-w-full sm:relative sm:top-0">
        <div className="absolute inset-0 right-0 min-w-full sm:pt-7 sm:left-auto sm:top-auto sm:bottom-auto">
          <div className="w-full h-full bg-background-active p-6 flex flex-col gap-y-6 overflow-auto sm:w-123 sm:rounded-lg sm:border sm:border-blue">
            <div className="flex flex-col gap-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-x-3">
                  <UserButton
                    address={address}
                    isVip={isVip}
                    isPrime={isPrime}
                    disabled
                    className="h-12"
                  />

                  <CopyAddressButton className="shrink-0 text-light-grey" address={address} />
                </div>

                <button
                  onClick={onClose}
                  type="button"
                  className="cursor-pointer text-light-grey hover:text-light-grey-hover"
                >
                  <Icon name="close" className="size-5 text-inherit transition-colors" />
                </button>
              </div>

              <ClaimRewardsButton className="h-12 bg-dark-blue-active sm:hidden" />
            </div>

            <AccountOverview accountAddress={address} showGraph={false} />

            <Settings />

            <div className="flex flex-col gap-y-3">
              {isVip && <VipTelegramGroupButton />}

              {/* When running in Safe Wallet app, user's wallet should be kept connected at all time */}
              {!config.isSafeApp && (
                <Button variant="secondary" onClick={handleDisconnect} className="w-full">
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
