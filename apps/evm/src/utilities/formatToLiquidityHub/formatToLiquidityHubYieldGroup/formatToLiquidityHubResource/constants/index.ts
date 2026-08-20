import placeholderIconSrc from 'assets/img/placeholderIcon.svg';

// TODO: point these at the real brand exports once design provides them (VPD-1880). Until then every
// agency renders the neutral placeholder, which keeps the cell from ever showing a broken image.
const moodysIconSrc = placeholderIconSrc;
const particulaIconSrc = placeholderIconSrc;
const spGlobalIconSrc = placeholderIconSrc;

export const PLACEHOLDER_AGENCY_ICON_SRC = placeholderIconSrc;

// Agencies are keyed by their name stripped of everything but alphanumerics, so that spelling
// variations the API may return ("Moody's" from the Centrifuge metadata vs the formal "Moody's
// Ratings") resolve to the same icon. An agency missing from this map falls back to the placeholder,
// so a newly covered agency renders correctly without a FE change.
export const agencyIconSrcByNameKey: Record<string, string> = {
  moodys: moodysIconSrc,
  moodysratings: moodysIconSrc,
  particula: particulaIconSrc,
  spglobal: spGlobalIconSrc,
  spglobalratings: spGlobalIconSrc,
};

export const getAgencyNameKey = (agencyName: string) =>
  agencyName.toLowerCase().replace(/[^a-z0-9]/g, '');
