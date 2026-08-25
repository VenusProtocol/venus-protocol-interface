import { ButtonWrapper } from '@venusprotocol/ui';
import { Icon } from 'components';
import config from 'config';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
import { useAnalytics } from 'libs/analytics';
import { useTranslation } from 'libs/translations';
import { useEffect, useRef } from 'react';
import { ChainId } from 'types';

const analyticProps = {
  productPromoted: 'USDT Fixed-Term vault',
  ctaUrl: `${window.location.origin}/#${routes.vaults.path}`,
};

export const MarketsAdBanner: React.FC = () => {
  const { captureAnalyticEvent } = useAnalytics();
  const captureAnalyticEventRef = useRef(captureAnalyticEvent);

  const [userChainSettings, setUserChainSettings] = useUserChainSettings();

  const onClick = () => captureAnalyticEvent('promo_banner_cta_click', analyticProps);

  const handleClose = () => {
    captureAnalyticEvent('promo_banner_dismissed', analyticProps);

    setUserChainSettings({
      doNotShowFixedRateVaultsAdBanner: true,
    });
  };

  const { t } = useTranslation();

  const shouldShowMarketsAdBanner = !userChainSettings.doNotShowFixedRateVaultsAdBanner;

  useEffect(() => {
    if (shouldShowMarketsAdBanner) {
      captureAnalyticEventRef.current('promo_banner_viewed', analyticProps);
    }
  }, [shouldShowMarketsAdBanner]);

  if (!shouldShowMarketsAdBanner) {
    return undefined;
  }

  return (
    <div className="w-full px-5 py-4 bg-linear-to-r from-[#01193A] to-[#0D3CB1] flex items-center justify-center">
      <div className="flex items-center gap-x-3">
        <div className="flex flex-col gap-y-1 sm:gap-y-2 lg:flex-row lg:items-center lg:gap-x-3">
          <p className="text-p3s text-center">{t('layout.header.dashboardAdBanner.title')}</p>

          <ButtonWrapper asChild size="xs">
            <Link
              to={routes.vaults.path}
              chainId={config.network === 'testnet' ? ChainId.BSC_TESTNET : ChainId.BSC_MAINNET}
              noStyle
              onClick={onClick}
            >
              {t('layout.header.dashboardAdBanner.buttonLabel')}
            </Link>
          </ButtonWrapper>
        </div>

        <button type="button" className="cursor-pointer" onClick={handleClose} aria-label="Close">
          <Icon name="close" className="size-5" />
        </button>
      </div>
    </div>
  );
};
