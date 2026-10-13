import { DEFAULT_VENUE, VenueName, getVenueConfig } from '..';

describe('getVenueConfig', () => {
  it('returns the Hash Global logo and website instead of the Venus fallback', () => {
    const venue = getVenueConfig('Hash Global');

    expect(venue.name).toBe(VenueName.HashGlobal);
    expect(venue.iconSrc).not.toBe(DEFAULT_VENUE.iconSrc);
    expect(venue.url).toBe('https://www.hashglobal.io/');
  });

  it('matches venue names regardless of case and surrounding spaces', () => {
    expect(getVenueConfig('  hash global ').name).toBe(VenueName.HashGlobal);
  });

  it('keeps the name of an unknown venue on the Venus fallback', () => {
    const venue = getVenueConfig('Unknown Venue');

    expect(venue.name).toBe('Unknown Venue');
    expect(venue.iconSrc).toBe(DEFAULT_VENUE.iconSrc);
  });
});
