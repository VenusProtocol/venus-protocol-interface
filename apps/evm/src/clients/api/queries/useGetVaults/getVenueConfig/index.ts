import cactusIconSrc from './cactus.svg';
import ceffuIconSrc from './ceffu.svg';
import matrixdockIconSrc from './matrixdock.svg';
import pendleIconSrc from './pendle.svg';
import venusIconSrc from './venus.svg';

export enum VenueName {
  Venus = 'Venus',
  Pendle = 'Pendle',
  Matrixdock = 'Matrixdock',
  Ceffu = 'Ceffu',
  Cactus = 'Cactus',
}

export interface VenueConfig {
  name: string;
  iconSrc: string;
  url?: string;
}

const iconSrcByVenueName: Record<VenueName, string> = {
  [VenueName.Venus]: venusIconSrc,
  [VenueName.Pendle]: pendleIconSrc,
  [VenueName.Matrixdock]: matrixdockIconSrc,
  [VenueName.Ceffu]: ceffuIconSrc,
  [VenueName.Cactus]: cactusIconSrc,
};

const urlByVenueName: Record<VenueName, string> = {
  [VenueName.Venus]: 'https://venus.io',
  [VenueName.Pendle]: 'https://pendle.finance',
  [VenueName.Matrixdock]: 'https://www.matrixdock.com/',
  [VenueName.Ceffu]: 'https://www.ceffu.com/',
  [VenueName.Cactus]: 'https://www.cactuscustody.com/',
};

export const DEFAULT_VENUE_NAME = VenueName.Venus;

export const DEFAULT_VENUE: VenueConfig = {
  name: DEFAULT_VENUE_NAME,
  iconSrc: iconSrcByVenueName[DEFAULT_VENUE_NAME],
  url: urlByVenueName[DEFAULT_VENUE_NAME],
};

const venueNameByKey = Object.fromEntries(
  Object.values(VenueName).map(venueName => [venueName.toLowerCase(), venueName]),
) as Record<string, VenueName>;

export const getVenueConfig = (venueName?: string): VenueConfig => {
  const key = (venueName ?? '').trim().toLowerCase();

  if (!key) {
    return DEFAULT_VENUE;
  }

  const matchedVenueName = venueNameByKey[key];

  if (!matchedVenueName) {
    return { ...DEFAULT_VENUE, name: venueName as string };
  }

  return {
    name: matchedVenueName,
    iconSrc: iconSrcByVenueName[matchedVenueName],
    url: urlByVenueName[matchedVenueName],
  };
};
