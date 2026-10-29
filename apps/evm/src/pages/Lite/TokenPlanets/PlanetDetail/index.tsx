import { PrimaryButton } from '@venusprotocol/ui';
import { useTranslation } from 'libs/translations';
import type { LiteEarnAsset } from '../../types';
import { useMarketName } from '../../useMarketName';

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
    >
      <strong className="lite-planet-detail__title">{earnAsset.token.symbol}</strong>

      <div className="lite-planet-detail__columns">
        <span>{t('lite.planets.market')}</span>
        <span>{t('lite.planets.supplyApy')}</span>
      </div>

      {earnAsset.markets.map(market => (
        <div key={market.id} className="lite-planet-detail__market">
          <span>{getMarketName(market)}</span>

          <span className="lite-planet-detail__rate">
            <strong>
              {market.apyPercentage.isFinite() ? `${market.apyPercentage.toFixed(2)}%` : '—'}
            </strong>
          </span>
        </div>
      ))}

      <PrimaryButton className="lite-planet-detail__action" onClick={onEarn}>
        {t('lite.planets.earnNow')}
      </PrimaryButton>
    </div>
  );
};
