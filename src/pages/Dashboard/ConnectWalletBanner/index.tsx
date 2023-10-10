import { Card, PrimaryButton } from 'components';
import React from 'react';
import { useTranslation } from 'translation';

import { useAuth } from 'context/AuthContext';

import illustration from './illustration.png';

export interface ConnectWalletBannerUiProps {
  isWalletConnected: boolean;
  openAuthModal: () => void;
}

export const ConnectWalletBannerUi: React.FC<ConnectWalletBannerUiProps> = ({
  isWalletConnected,
  openAuthModal,
  ...containerProps
}) => {
  const { t } = useTranslation();

  if (isWalletConnected) {
    return null;
  }

  return (
    <Card
      className="mb-8 flex flex-col overflow-hidden border border-lightGrey p-0 sm:grid sm:grid-cols-[3fr,2fr] sm:flex-row md:p-0 lg:grid-cols-[3fr,2fr] xl:grid-cols-2"
      {...containerProps}
    >
      <div className="sm:flex-4 px-4 py-6 text-center sm:p-4 sm:text-left md:p-6">
        <p className="mb-3 text-lg">{t('dashboard.connectWalletBanner.title')}</p>

        <p className="mb-8 text-grey">{t('dashboard.connectWalletBanner.description')}</p>

        <PrimaryButton className="w-full sm:w-auto" onClick={openAuthModal}>
          {t('dashboard.connectWalletBanner.buttonLabel')}
        </PrimaryButton>
      </div>

      <div className="sm:flex-4 lg:flex-5 relative -order-1 h-50 overflow-hidden bg-lightGrey sm:order-none sm:h-full sm:overflow-visible sm:bg-transparent">
        <img
          src={illustration}
          className="absolute -top-7 right-[50%] -mr-46 w-84 max-w-none sm:-right-26 sm:-top-3 sm:mr-0 md:-right-10 lg:-right-6 xl:-top-10 xl:right-[50%] xl:-mr-50 xl:w-100"
          alt={t('dashboard.connectWalletBanner.illustration.alt')}
        />
      </div>
    </Card>
  );
};

export const ConnectWalletBanner: React.FC = () => {
  const { accountAddress, openAuthModal } = useAuth();

  return (
    <ConnectWalletBannerUi isWalletConnected={!!accountAddress} openAuthModal={openAuthModal} />
  );
};
