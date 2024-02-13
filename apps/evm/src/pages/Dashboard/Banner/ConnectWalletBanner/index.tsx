import { Card, PrimaryButton } from 'components';
import { useTranslation } from 'libs/translations';

import illustration from './illustration.png';

export interface ConnectWalletBannerProps {
  openAuthModal: () => void;
}

export const ConnectWalletBanner: React.FC<ConnectWalletBannerProps> = ({ openAuthModal }) => {
  const { t } = useTranslation();

  return (
    <Card className="border-lightGrey mb-8 flex flex-col overflow-hidden border p-0 sm:grid sm:grid-cols-[3fr,2fr] sm:flex-row md:p-0 lg:grid-cols-[3fr,2fr] xl:grid-cols-2">
      <div className="sm:flex-4 px-4 py-6 text-center sm:p-4 sm:text-left md:p-6">
        <p className="mb-3 text-lg">{t('dashboard.connectWalletBanner.title')}</p>

        <p className="text-grey mb-8">{t('dashboard.connectWalletBanner.description')}</p>

        <PrimaryButton className="w-full sm:w-auto" onClick={openAuthModal}>
          {t('dashboard.connectWalletBanner.buttonLabel')}
        </PrimaryButton>
      </div>

      <div className="sm:flex-4 lg:flex-5 h-50 bg-lightGrey relative -order-1 overflow-hidden sm:order-none sm:h-full sm:overflow-visible sm:bg-transparent">
        <img
          src={illustration}
          className="-mr-46 w-84 sm:-right-26 xl:-mr-50 xl:w-100 absolute -top-7 right-[50%] max-w-none sm:-top-3 sm:mr-0 md:-right-10 lg:-right-6 xl:-top-10 xl:right-[50%]"
          alt={t('dashboard.connectWalletBanner.illustration.alt')}
        />
      </div>
    </Card>
  );
};
