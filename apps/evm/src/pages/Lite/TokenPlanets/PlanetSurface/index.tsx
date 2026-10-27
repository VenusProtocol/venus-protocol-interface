import type { CSSProperties } from 'react';
import { PLANET_PALETTES } from '../palettes';

export interface PlanetSurfaceProps {
  symbol: string;
}

export const PlanetSurface: React.FC<PlanetSurfaceProps> = ({ symbol }) => {
  const [light, mid, dark] = PLANET_PALETTES[symbol] ?? PLANET_PALETTES.USDC;

  return (
    <span
      aria-hidden="true"
      className="lite-planet-sphere"
      style={
        {
          '--planet-light': light,
          '--planet-mid': mid,
          '--planet-dark': dark,
        } as CSSProperties
      }
    />
  );
};
