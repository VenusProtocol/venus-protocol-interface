import { useIsLgDown } from 'hooks/responsive';
import { useTranslation } from 'libs/translations';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { WIDE_BACKGROUND_ASSET_SYMBOLS } from '../constants';
import type { LiteEarnAsset } from '../types';
import { AsciiPlanet } from './AsciiPlanet';
import { AsciiTokenMark } from './AsciiTokenMark';
import { PlanetDetail } from './PlanetDetail';
import { getPlanetRank } from './getPlanetRank';
import './planets.css';

export interface TokenPlanetsProps {
  earnAssets: LiteEarnAsset[];
  onSelect: (earnAsset: LiteEarnAsset) => void;
}

export const TokenPlanets: React.FC<TokenPlanetsProps> = ({ earnAssets, onSelect }) => {
  const { t } = useTranslation();
  const isCompact = useIsLgDown();
  const [openKey, setOpenKey] = useState<string>();
  const [replay, setReplay] = useState({ key: '', count: 0 });

  const planets = earnAssets
    .filter(earnAsset => WIDE_BACKGROUND_ASSET_SYMBOLS.includes(earnAsset.token.symbol))
    .sort((a, b) => getPlanetRank(a.token.symbol) - getPlanetRank(b.token.symbol));

  if (isCompact || planets.length === 0) {
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
            onClick={() => {
              setReplay(previous => ({ key: earnAsset.key, count: previous.count + 1 }));
              setOpenKey(undefined);
              onSelect(earnAsset);
            }}
          >
            <AsciiPlanet
              symbol={earnAsset.token.symbol}
              isOpen={openKey === earnAsset.key}
              replayToken={replay.key === earnAsset.key ? replay.count : 0}
            />

            <AsciiTokenMark
              symbol={earnAsset.token.symbol}
              src={earnAsset.token.iconSrc}
              isOpen={openKey === earnAsset.key}
              replayToken={replay.key === earnAsset.key ? replay.count : 0}
            />
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

  return createPortal(content, document.body);
};
