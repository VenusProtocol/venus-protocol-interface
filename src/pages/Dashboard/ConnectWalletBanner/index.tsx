/** @jsxImportSource @emotion/react */
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
      className="mb-8 flex flex-col overflow-hidden border border-lightGrey p-0 sm:grid sm:grid-cols-[3fr,2fr] sm:flex-row lg:grid-cols-[3fr,2fr] xl:grid-cols-2"
      {...containerProps}
    >
      <div className="sm:flex-4 px-4 py-6 text-center sm:px-6 sm:text-left">
        <p className="mb-3 text-lg">{t('dashboard.connectWalletBanner.title')}</p>

        <p className="text-grey mb-8">{t('dashboard.connectWalletBanner.description')}</p>

        <PrimaryButton className="w-full sm:w-auto" onClick={openAuthModal}>
          {t('dashboard.connectWalletBanner.buttonLabel')}
        </PrimaryButton>
      </div>

      <div className="h-50 sm:flex-4 lg:flex-5 sm:bg-transparent relative -order-1 overflow-hidden bg-lightGrey sm:order-none sm:h-full sm:overflow-visible">
        <img
          src={illustration}
          className="w-84 -mr-46 sm:-right-26 xl:w-100 xl:-mr-50 absolute -top-7 right-[50%] max-w-none sm:-top-3 sm:mr-0 md:-right-10 lg:-right-6 xl:-top-10 xl:right-[50%]"
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
