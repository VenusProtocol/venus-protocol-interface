import placeholderIconSrc from 'assets/img/placeholderIcon.svg';
// Extracted from the Rating component of the Venus UI Kits_new Figma library, which the Figma MCP
// cannot export directly. Moody's and Particula are rasters (56px / 80px) because that is what the
// library holds; ask design for vector exports if they become available (VPD-1880).
import moodysIconSrc from 'assets/img/ratingAgencies/moodys.png';
import particulaIconSrc from 'assets/img/ratingAgencies/particula.png';
import spGlobalIconSrc from 'assets/img/ratingAgencies/spGlobal.svg';

export const PLACEHOLDER_AGENCY_ICON_SRC = placeholderIconSrc;

// Agencies are keyed by their name stripped of everything but alphanumerics, so that spelling
// variations the API may return ("Moody's" from the Centrifuge metadata vs the formal "Moody's
// Ratings") resolve to the same icon
export const AGENCY_ICON_SRC_BY_NAME_KEY: Record<string, string> = {
  moodys: moodysIconSrc,
  moodysratings: moodysIconSrc,
  particula: particulaIconSrc,
  spglobal: spGlobalIconSrc,
  spglobalratings: spGlobalIconSrc,
};
