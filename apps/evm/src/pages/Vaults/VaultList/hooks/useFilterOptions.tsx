import { Icon } from 'components';
import { useTranslation } from 'libs/translations';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { VaultCategory, VaultStatus, VaultVenue } from 'types';
import { getVaultCategoryName } from 'utilities/getVaultCategoryName';

import institutionIconSrc from '../asset/institution.svg';

const CATEGORY_PARAM_KEY = 'category';
const VENUE_PARAM_KEY = 'venue';
const STATUS_PARAM_KEY = 'status';

const PARAM_VALUE_SEPARATOR = ',';

const LEGACY_ACTIVE_STATUS_VALUE = 'active';

const SELECTABLE_CATEGORY_VALUES: string[] = Object.values(VaultCategory);
const SELECTABLE_VENUE_VALUES: string[] = Object.values(VaultVenue);
// Listed in the order the design displays them, which also drives the order of
// the values we serialize back into the URL
const SELECTABLE_STATUS_VALUES: string[] = [
  VaultStatus.Deposit,
  VaultStatus.Refund,
  VaultStatus.Locked,
  VaultStatus.Repaying,
  VaultStatus.Claim,
  VaultStatus.Pending,
  VaultStatus.Inactive,
  VaultStatus.Liquidated,
  VaultStatus.Paused,
];

const readParamValues = (searchParams: URLSearchParams, key: string) =>
  (searchParams.get(key) ?? '')
    .split(PARAM_VALUE_SEPARATOR)
    .map(value => value.trim())
    .filter(value => value.length > 0);

// Selecting the values from the reference list rather than from the URL keeps unknown
// values out, deduplicates, and guarantees a stable order whatever the URL contains
const parseParamValues = ({
  searchParams,
  key,
  selectableValues,
}: {
  searchParams: URLSearchParams;
  key: string;
  selectableValues: string[];
}) => {
  const paramValues = readParamValues(searchParams, key);
  return selectableValues.filter(selectableValue => paramValues.includes(selectableValue));
};

export const useFilterOptions = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const categories = parseParamValues({
    searchParams,
    key: CATEGORY_PARAM_KEY,
    selectableValues: SELECTABLE_CATEGORY_VALUES,
  });

  const venues = parseParamValues({
    searchParams,
    key: VENUE_PARAM_KEY,
    selectableValues: SELECTABLE_VENUE_VALUES,
  });

  const rawStatusValues = readParamValues(searchParams, STATUS_PARAM_KEY);
  const isLegacyStatus = rawStatusValues.includes(LEGACY_ACTIVE_STATUS_VALUE);
  const statusValues = rawStatusValues.map(value =>
    value === LEGACY_ACTIVE_STATUS_VALUE ? VaultStatus.Deposit : value,
  );
  const statuses = SELECTABLE_STATUS_VALUES.filter(selectableValue =>
    statusValues.includes(selectableValue),
  );
  const serializedStatuses = statuses.join(PARAM_VALUE_SEPARATOR);

  // Filter changes replace the current history entry rather than pushing a new one, so
  // going back leaves the page instead of stepping through every option that was toggled
  const setParamValues = (key: string, newValues: string[]) =>
    setSearchParams(
      currentSearchParams => {
        const newSearchParams = Object.fromEntries(currentSearchParams);

        if (newValues.length === 0) {
          delete newSearchParams[key];
        } else {
          newSearchParams[key] = newValues.join(PARAM_VALUE_SEPARATOR);
        }

        return newSearchParams;
      },
      { replace: true },
    );

  useEffect(() => {
    if (!isLegacyStatus) {
      return;
    }

    setSearchParams(
      currentSearchParams => {
        const newSearchParams = Object.fromEntries(currentSearchParams);

        if (serializedStatuses) {
          newSearchParams[STATUS_PARAM_KEY] = serializedStatuses;
        } else {
          delete newSearchParams[STATUS_PARAM_KEY];
        }

        return newSearchParams;
      },
      { replace: true },
    );
  }, [isLegacyStatus, serializedStatuses, setSearchParams]);

  const setCategories = (newValues: string[]) => setParamValues(CATEGORY_PARAM_KEY, newValues);
  const setVenues = (newValues: string[]) => setParamValues(VENUE_PARAM_KEY, newValues);
  const setStatuses = (newValues: string[]) => setParamValues(STATUS_PARAM_KEY, newValues);

  const reset = () =>
    setSearchParams(
      currentSearchParams => {
        const newSearchParams = Object.fromEntries(currentSearchParams);

        delete newSearchParams[CATEGORY_PARAM_KEY];
        delete newSearchParams[VENUE_PARAM_KEY];
        delete newSearchParams[STATUS_PARAM_KEY];

        return newSearchParams;
      },
      { replace: true },
    );

  const categoryOptions = Object.values(VaultCategory).map(category => ({
    label: getVaultCategoryName({
      category,
      t,
    }),
    value: category,
  }));

  const venueOptions = [
    {
      label: (
        <div className="flex items-center gap-2">
          <Icon name="logoMobile" />
          Venus
        </div>
      ),
      value: VaultVenue.Venus,
    },
    {
      label: (
        <div className="flex items-center gap-2">
          <Icon name="pendle" />
          Pendle
        </div>
      ),
      value: VaultVenue.Pendle,
    },
    {
      label: (
        <div className="flex items-center gap-2">
          <img src={institutionIconSrc} className="size-4" alt="" />
          {t('vault.filter.institution')}
        </div>
      ),
      value: VaultVenue.Institution,
    },
  ];

  const statusOptions = [
    {
      label: t('vault.filter.deposit'),
      value: VaultStatus.Deposit,
    },
    {
      label: t('vault.filter.refund'),
      value: VaultStatus.Refund,
    },
    {
      label: t('vault.filter.locked'),
      value: VaultStatus.Locked,
    },
    {
      label: t('vault.filter.repaying'),
      value: VaultStatus.Repaying,
    },
    {
      label: t('vault.filter.claim'),
      value: VaultStatus.Claim,
    },
    {
      label: t('vault.filter.pending'),
      value: VaultStatus.Pending,
    },
    {
      label: t('vault.filter.inactive'),
      value: VaultStatus.Inactive,
    },
    {
      label: t('vault.filter.liquidated'),
      value: VaultStatus.Liquidated,
    },
    {
      label: t('vault.filter.paused'),
      value: VaultStatus.Paused,
    },
  ];

  return {
    categories,
    setCategories,
    categoryOptions,
    venues,
    setVenues,
    venueOptions,
    statuses,
    setStatuses,
    statusOptions,
    reset,
  };
};
