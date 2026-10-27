import { useIsMdDown } from 'hooks/responsive';
import { useTranslation } from 'libs/translations';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { LiteEarnAsset } from '../types';
import { PlanetDetail } from './PlanetDetail';
import { PlanetSurface } from './PlanetSurface';
import { getPlanetRank } from './getPlanetRank';
import { RINGED_PLANET_SYMBOLS } from './palettes';
import './planets.css';
import wbethPlanetMarkSrc from './wbethPlanetMark.svg';

const COMPACT_PLANET_COUNT = 4;
const PLANET_COUNT = 8;

export interface TokenPlanetsProps {
  earnAssets: LiteEarnAsset[];
  onSelect: (earnAsset: LiteEarnAsset) => void;
}

export const TokenPlanets: React.FC<TokenPlanetsProps> = ({ earnAssets, onSelect }) => {
  const { t } = useTranslation();
  const isCompact = useIsMdDown();
  const [openKey, setOpenKey] = useState<string>();

  const planets = [...earnAssets]
    .sort((a, b) => getPlanetRank(a.token.symbol) - getPlanetRank(b.token.symbol))
    .slice(0, isCompact ? COMPACT_PLANET_COUNT : PLANET_COUNT);

  if (planets.length === 0) {
    return null;
  }

  const content = (
    <aside className="lite-planets" aria-label={t('lite.planets.label')}>
      {planets.map((earnAsset, index) => (
        <div
          key={earnAsset.key}
          className={`lite-planet lite-planet--${index + 1}`}
          data-open={openKey === earnAsset.key}
          data-token={earnAsset.token.symbol}
          data-ring={RINGED_PLANET_SYMBOLS.includes(earnAsset.token.symbol)}
          onMouseEnter={() => setOpenKey(earnAsset.key)}
          onMouseLeave={() => setOpenKey(undefined)}
          onBlur={event => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setOpenKey(undefined);
            }
          }}
          onKeyDown={event => {
            if (event.key === 'Escape') {
              setOpenKey(undefined);
              event.stopPropagation();
            }
          }}
        >
          <button
            type="button"
            className="lite-planet__orb"
            aria-label={t('lite.planets.openAriaLabel', { symbol: earnAsset.token.symbol })}
            aria-expanded={openKey === earnAsset.key}
            aria-controls={`lite-planet-${index}`}
            onFocus={() => setOpenKey(earnAsset.key)}
            onClick={() => setOpenKey(earnAsset.key)}
          >
            <span aria-hidden="true" className="lite-planet__ring lite-planet__ring--back" />

            <PlanetSurface symbol={earnAsset.token.symbol} />

            <img
              alt={earnAsset.token.symbol}
              src={
                earnAsset.token.symbol === 'WBETH' ? wbethPlanetMarkSrc : earnAsset.token.iconSrc
              }
            />

            <span aria-hidden="true" className="lite-planet__ring lite-planet__ring--front" />
          </button>

          {openKey === earnAsset.key && (
            <PlanetDetail
              id={`lite-planet-${index}`}
              earnAsset={earnAsset}
              onEarn={() => {
                onSelect(earnAsset);
                setOpenKey(undefined);
              }}
            />
          )}
        </div>
      ))}
    </aside>
  );

  return isCompact ? content : createPortal(content, document.body);
};
