import { AGENCY_ICON_SRC_BY_NAME_KEY, PLACEHOLDER_AGENCY_ICON_SRC } from '../constants';

import { getAgencyIconSrc } from '..';

describe('getAgencyIconSrc', () => {
  it('resolves a known agency regardless of punctuation and casing', () => {
    expect(getAgencyIconSrc("Moody's")).toBe(AGENCY_ICON_SRC_BY_NAME_KEY.moodys);
    expect(getAgencyIconSrc("Moody's Ratings")).toBe(AGENCY_ICON_SRC_BY_NAME_KEY.moodys);
    expect(getAgencyIconSrc('S&P Global Ratings')).toBe(AGENCY_ICON_SRC_BY_NAME_KEY.spglobal);
    expect(getAgencyIconSrc('particula')).toBe(AGENCY_ICON_SRC_BY_NAME_KEY.particula);
  });

  it('falls back to the placeholder for an agency it does not know', () => {
    expect(getAgencyIconSrc('Brand New Agency')).toBe(PLACEHOLDER_AGENCY_ICON_SRC);
  });
});
