import { PrimaryButton } from '@venusprotocol/ui';
import { useTranslation } from 'libs/translations';
import { MarketApy } from '../../MarketApy';
import type { LiteEarnAsset } from '../../types';
import { useMarketName } from '../../useMarketName';

const VIEWPORT_MARGIN_PX = 16;

const fitToViewport = (node: HTMLDivElement | null) => {
  const planet = node?.parentElement;

  if (!node || !planet) {
    return;
  }

  const planetRect = planet.getBoundingClientRect();
  const headerBottom = document.querySelector('nav')?.getBoundingClientRect().bottom ?? 0;
  const spaceBelow = window.innerHeight - planetRect.bottom - VIEWPORT_MARGIN_PX;
  const spaceAbove = planetRect.top - headerBottom - VIEWPORT_MARGIN_PX;
  const opensUpwards = node.offsetHeight > spaceBelow && spaceAbove > spaceBelow;
  const alignsRight = planetRect.left + node.offsetWidth > window.innerWidth - VIEWPORT_MARGIN_PX;

  node.style.top = opensUpwards ? 'auto' : '100%';
  node.style.bottom = opensUpwards ? '100%' : 'auto';
  node.style.left = alignsRight ? 'auto' : '0';
  node.style.right = alignsRight ? '0' : 'auto';
};

export interface PlanetDetailProps {
  id: string;
  earnAsset: LiteEarnAsset;
  onEarn: () => void;
}

export const PlanetDetail: React.FC<PlanetDetailProps> = ({ id, earnAsset, onEarn }) => {
  const { t } = useTranslation();
  const getMarketName = useMarketName();

  return (
    <div
      id={id}
      role="dialog"
      aria-label={t('lite.planets.openAriaLabel', { symbol: earnAsset.token.symbol })}
      className="lite-planet-detail"
      ref={fitToViewport}
    >
      <strong className="lite-planet-detail__title">{earnAsset.token.symbol}</strong>

      <div className="lite-planet-detail__columns">
        <span>{t('lite.planets.market')}</span>
        <span>{t('lite.planets.supplyApy')}</span>
      </div>

      {earnAsset.markets.map(market => (
        <div key={market.id} className="lite-planet-detail__market">
          <span>{getMarketName(market)}</span>

          <MarketApy source={market.source} className="lite-planet-detail__rate" />
        </div>
      ))}

      <PrimaryButton className="lite-planet-detail__action" onClick={onEarn}>
        {t('lite.planets.earnNow')}
      </PrimaryButton>
    </div>
  );
};
