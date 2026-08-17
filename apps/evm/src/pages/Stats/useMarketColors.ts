import { useGetRiskDashboardMarketSnapshots } from 'clients/api';
import { useImageAccentColors } from 'hooks/useImageAccentColors';
import { useGetVTokens } from 'libs/tokens/hooks/useGetVTokens';
import { useMemo } from 'react';
import { getAddress } from 'viem';

const CHART_COLOR_SATURATION_PERCENT = 70;
const CHART_COLOR_LIGHTNESS_PERCENT = 55;
const HUE_DEGREES_IN_CIRCLE = 360;
const MIN_HUE_SEPARATION_DEGREES = 12;
const HUE_CANDIDATE_STEP_DEGREES = 4;
const MAX_HUE_NUDGE_DEGREES = 60;

const parseHexColor = (hex: string) => {
  const stripped = hex.startsWith('#') ? hex.slice(1) : hex;
  if (stripped.length !== 6) {
    return null;
  }

  const red = Number.parseInt(stripped.slice(0, 2), 16);
  const green = Number.parseInt(stripped.slice(2, 4), 16);
  const blue = Number.parseInt(stripped.slice(4, 6), 16);

  if (Number.isNaN(red) || Number.isNaN(green) || Number.isNaN(blue)) {
    return null;
  }

  return { red, green, blue };
};

const getHueFromHexColor = (hex: string) => {
  const parsed = parseHexColor(hex);
  if (!parsed) {
    return null;
  }

  const red = parsed.red / 255;
  const green = parsed.green / 255;
  const blue = parsed.blue / 255;

  const maxChannel = Math.max(red, green, blue);
  const minChannel = Math.min(red, green, blue);
  const chroma = maxChannel - minChannel;
  if (chroma === 0) {
    return 0;
  }

  let huePosition: number;
  if (maxChannel === red) {
    huePosition = ((green - blue) / chroma) % 6;
  } else if (maxChannel === green) {
    huePosition = (blue - red) / chroma + 2;
  } else {
    huePosition = (red - green) / chroma + 4;
  }

  const hueDegrees = huePosition * 60;
  if (hueDegrees < 0) {
    return hueDegrees + HUE_DEGREES_IN_CIRCLE;
  }
  return hueDegrees;
};

const hueDistance = (hueA: number, hueB: number) => {
  const diff = Math.abs(hueA - hueB) % HUE_DEGREES_IN_CIRCLE;
  return Math.min(diff, HUE_DEGREES_IN_CIRCLE - diff);
};

const minDistanceToClaimed = (candidate: number, claimedHues: number[]) => {
  if (claimedHues.length === 0) {
    return HUE_DEGREES_IN_CIRCLE;
  }
  let minDistance = HUE_DEGREES_IN_CIRCLE;
  for (const claimed of claimedHues) {
    const distance = hueDistance(candidate, claimed);
    if (distance < minDistance) {
      minDistance = distance;
    }
  }
  return minDistance;
};

const wrapHue = (hue: number) =>
  ((hue % HUE_DEGREES_IN_CIRCLE) + HUE_DEGREES_IN_CIRCLE) % HUE_DEGREES_IN_CIRCLE;

const findHueNearPreferred = (preferred: number, claimedHues: number[]) => {
  if (minDistanceToClaimed(preferred, claimedHues) >= MIN_HUE_SEPARATION_DEGREES) {
    return preferred;
  }
  for (
    let offset = HUE_CANDIDATE_STEP_DEGREES;
    offset <= MAX_HUE_NUDGE_DEGREES;
    offset += HUE_CANDIDATE_STEP_DEGREES
  ) {
    for (const direction of [1, -1] as const) {
      const candidate = wrapHue(preferred + direction * offset);
      if (minDistanceToClaimed(candidate, claimedHues) >= MIN_HUE_SEPARATION_DEGREES) {
        return candidate;
      }
    }
  }
  return preferred;
};

const findFurthestFreeHue = (claimedHues: number[]) => {
  let bestHue = 0;
  let bestDistance = -1;
  for (
    let candidate = 0;
    candidate < HUE_DEGREES_IN_CIRCLE;
    candidate += HUE_CANDIDATE_STEP_DEGREES
  ) {
    const distance = minDistanceToClaimed(candidate, claimedHues);
    if (distance > bestDistance) {
      bestDistance = distance;
      bestHue = candidate;
    }
  }
  return bestHue;
};

const assignHues = (marketsBySizeDesc: string[], preferredHueByMarket: Record<string, number>) => {
  const hueByMarket: Record<string, number> = {};
  const claimedHues: number[] = [];

  for (const market of marketsBySizeDesc) {
    const preferred = preferredHueByMarket[market];
    if (preferred === undefined) {
      continue;
    }
    const chosen = findHueNearPreferred(preferred, claimedHues);
    hueByMarket[market] = chosen;
    claimedHues.push(chosen);
  }

  for (const market of marketsBySizeDesc) {
    if (hueByMarket[market] !== undefined) {
      continue;
    }
    const fallback = findFurthestFreeHue(claimedHues);
    hueByMarket[market] = fallback;
    claimedHues.push(fallback);
  }

  return hueByMarket;
};

const formatHsl = (hue: number) =>
  `hsl(${hue.toFixed(2)} ${CHART_COLOR_SATURATION_PERCENT}% ${CHART_COLOR_LIGHTNESS_PERCENT}%)`;

export interface MarketColors {
  colorByMarket: Record<string, string>;
}

export const useMarketColors = (): MarketColors => {
  const vTokens = useGetVTokens();
  const { data: snapshots } = useGetRiskDashboardMarketSnapshots({ kind: 'day' });

  const marketAddresses = useMemo(
    () => vTokens.map(vToken => getAddress(vToken.address)),
    [vTokens],
  );

  const iconByMarket = useMemo(() => {
    const map: Record<string, string> = {};
    for (const vToken of vTokens) {
      const iconSrc = vToken.underlyingToken.iconSrc;
      if (iconSrc) {
        map[getAddress(vToken.address)] = iconSrc;
      }
    }
    return map;
  }, [vTokens]);

  const iconPaths = useMemo(() => Object.values(iconByMarket), [iconByMarket]);
  const colorsByIcon = useImageAccentColors(iconPaths);

  const preferredHueByMarket = useMemo(() => {
    const hues: Record<string, number> = {};
    for (const market of marketAddresses) {
      const iconSrc = iconByMarket[market];
      if (!iconSrc) {
        continue;
      }
      const iconColor = colorsByIcon[iconSrc];
      if (!iconColor) {
        continue;
      }
      const hue = getHueFromHexColor(iconColor);
      if (hue !== null) {
        hues[market] = hue;
      }
    }
    return hues;
  }, [marketAddresses, iconByMarket, colorsByIcon]);

  const marketsBySizeDesc = useMemo(() => {
    const supplyByMarket = new Map<string, number>();
    const latestSlot = snapshots?.series.at(-1);
    if (latestSlot) {
      for (const point of latestSlot.byMarket) {
        supplyByMarket.set(getAddress(point.marketAddress), Number(point.supplyUsdCents));
      }
    }
    return [...marketAddresses].sort(
      (marketA, marketB) => (supplyByMarket.get(marketB) ?? 0) - (supplyByMarket.get(marketA) ?? 0),
    );
  }, [marketAddresses, snapshots]);

  const hueByMarket = useMemo(
    () => assignHues(marketsBySizeDesc, preferredHueByMarket),
    [marketsBySizeDesc, preferredHueByMarket],
  );

  const colorByMarket = useMemo(() => {
    const colors: Record<string, string> = {};
    for (const market of marketAddresses) {
      const hue = hueByMarket[market];
      if (hue !== undefined) {
        colors[market] = formatHsl(hue);
      }
    }
    return colors;
  }, [marketAddresses, hueByMarket]);

  return { colorByMarket };
};
