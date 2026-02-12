import { useTranslation } from 'libs/translations';
import { Banner } from '../Banner';
import phoneIllustrationSrc from './phoneIllustration.png';

const BINANCE_WALLET_URL = 'https://binance.onelink.me/mL1z/vpktofz8?af_force_deeplink=true';

export const BinanceWalletBanner: React.FC = () => {
  const { t, Trans } = useTranslation();

  return (
    <Banner
      title={t('adCarousel.binanceWalletBanner.title')}
      description={
        <Trans
          i18nKey="adCarousel.binanceWalletBanner.description"
          components={{
            WhiteText: <span className="text-white" />,
          }}
        />
      }
      buttonLabel={t('adCarousel.binanceWalletBanner.buttonLabel')}
      className="bg-[linear-gradient(142deg,#00193A_20%,#0E3FB7_75%,#001E68_95%)]"
      href={BINANCE_WALLET_URL}
    >
      <img
        className="absolute w-80 max-w-none -bottom-10 -right-20 -rotate-15 @min-[357px]:w-120 @min-[357px]:-rotate-12 @min-[357px]:-bottom-9 @min-[357px]:right-auto @min-[357px]:left-10 @min-[409px]:-rotate-15 @min-[409px]:-bottom-5 @min-[409px]:left-12 @min-[576px]:w-80 @min-[576px]:-bottom-10 @min-[576px]:left-auto @min-[576px]:-right-4 @min-[576px]:-rotate-22 @min-[896px]:w-120 @min-[896px]:-rotate-14 @min-[896px]:-bottom-19 @min-[896px]:right-20"
        src={phoneIllustrationSrc}
        alt={t('adCarousel.binanceWalletBanner.phoneIllustration.altText')}
      />
    </Banner>
  );
};
