import { AGENCY_ICON_SRC_BY_NAME_KEY, PLACEHOLDER_AGENCY_ICON_SRC } from './constants';

// An agency we have no icon for falls back to the neutral placeholder, so a newly covered agency
// renders correctly without a FE change and the cell never shows a broken image
export const getAgencyIconSrc = (agencyName: string) => {
  const nameKey = agencyName.toLowerCase().replace(/[^a-z0-9]/g, '');

  return AGENCY_ICON_SRC_BY_NAME_KEY[nameKey] ?? PLACEHOLDER_AGENCY_ICON_SRC;
};
