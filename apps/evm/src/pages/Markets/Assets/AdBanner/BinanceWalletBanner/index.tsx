import { useTranslation } from 'libs/translations';
import { Banner } from '../Banner';
import binanceLogoIllustration from './binanceLogo.svg';
import desktopBgIllustration from './desktopBgIllustration.png';
import mobileBgIllustration from './mobileBgIllustration.png';

const LEARN_MORE_URL = 'https://www.binance.com/en/events/w3e-bnb-defi-fest';

export const BinanceWalletBanner: React.FC = () => {
  const { t, Trans } = useTranslation();

  return (
    <Banner
      className="bg-[#F3BA2E] overflow-hidden"
      title={<span className="text-background">{t('binanceWalletBanner.title')}</span>}
      description={
        <span className="text-lightGrey">
          <Trans
            i18nKey="binanceWalletBanner.description"
            components={{
              Bold: <span className="font-semibold" />,
            }}
          />
        </span>
      }
      illustration={
        <img
          src={binanceLogoIllustration}
          alt={t('binanceWalletBanner.binanceLogoAltText')}
          className="size-10 sm:size-12 lg:size-14"
        />
      }
      backgroundIllustration={
        <>
          {/* Mobile illustration */}
          <img
            src={mobileBgIllustration}
            alt={t('binanceWalletBanner.bgIllustrationAltText')}
            className="absolute top-0 right-0 h-full sm:hidden"
          />

          {/* Tablet/desktop illustration */}
          <img
            src={desktopBgIllustration}
            alt={t('binanceWalletBanner.bgIllustrationAltText')}
            className="absolute top-0 right-5 h-full hidden sm:block lg:right-10 xl:right-40 2xl:right-78"
          />
        </>
      }
      learnMoreUrl={LEARN_MORE_URL}
    />
  );
};
