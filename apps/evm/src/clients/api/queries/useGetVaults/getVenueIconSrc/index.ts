import matrixdockIconSrc from './matrixdock.svg';
import pendleIconSrc from './pendle.svg';
import venusIconSrc from './venus.svg';

const venueIconSrcByName: Record<string, string> = {
  Venus: venusIconSrc,
  Pendle: pendleIconSrc,
  Matrixdock: matrixdockIconSrc,
};

export const getVenueIconSrc = (venueName: string): string => venueIconSrcByName[venueName] ?? '';
