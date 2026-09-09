import { Icon } from 'components';
import { useTranslation } from 'libs/translations';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { VaultCategory, VaultStatus, VaultVenue } from 'types';
import { getVaultCategoryName } from 'utilities/getVaultCategoryName';

import { CATEGORY_PARAM_KEY, STATUS_PARAM_KEY, VENUE_PARAM_KEY } from '../../constants';
import { deleteFilterSearchParams } from '../../utilities/deleteFilterSearchParams';
import institutionIconSrc from '../asset/institution.svg';

const PARAM_VALUE_SEPARATOR = ',';

const LEGACY_ACTIVE_STATUS_VALUE = 'active';

const readParamValues = (searchParams: URLSearchParams, key: string) =>
  (searchParams.get(key) ?? '')
    .split(PARAM_VALUE_SEPARATOR)
    .map(value => value.trim())
    .filter(value => value.length > 0);

// Selecting the values from the option list rather than from the URL keeps unknown values
// out, deduplicates, and orders the selection the way the options are displayed, whatever
// the URL contains
const parseParamValues = <TValue extends string>({
  searchParams,
  key,
  selectableValues,
}: {
  searchParams: URLSearchParams;
  key: string;
  selectableValues: TValue[];
}) => {
  const paramValues = readParamValues(searchParams, key);
  return selectableValues.filter(selectableValue => paramValues.includes(selectableValue));
};

export const useFilterOptions = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

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

  // Listed in the order the design displays them, which also drives the order of the
  // values we serialize back into the URL
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

  const selectableCategories = categoryOptions.map(({ value }) => value);
  const selectableVenues = venueOptions.map(({ value }) => value);
  const selectableStatuses = statusOptions.map(({ value }) => value);

  const categories = parseParamValues({
    searchParams,
    key: CATEGORY_PARAM_KEY,
    selectableValues: selectableCategories,
  });

  const venues = parseParamValues({
    searchParams,
    key: VENUE_PARAM_KEY,
    selectableValues: selectableVenues,
  });

  const rawStatusValues = readParamValues(searchParams, STATUS_PARAM_KEY);
  const isLegacyStatus = rawStatusValues.includes(LEGACY_ACTIVE_STATUS_VALUE);
  const statusValues = rawStatusValues.map(value =>
    value === LEGACY_ACTIVE_STATUS_VALUE ? VaultStatus.Deposit : value,
  );
  const statuses = selectableStatuses.filter(selectableValue =>
    statusValues.includes(selectableValue),
  );
  const serializedStatuses = statuses.join(PARAM_VALUE_SEPARATOR);

  // Filter changes replace the current history entry rather than pushing a new one, so
  // going back leaves the page instead of stepping through every option that was toggled
  const setParamValues = (key: string, newValues: string[], selectableValues: string[]) =>
    setSearchParams(
      currentSearchParams => {
        const newSearchParams = new URLSearchParams(currentSearchParams);
        // Serialized in the order the options are displayed rather than the order the
        // boxes were ticked, so the same selection always produces the same URL
        const orderedValues = selectableValues.filter(selectableValue =>
          newValues.includes(selectableValue),
        );

        if (orderedValues.length === 0) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, orderedValues.join(PARAM_VALUE_SEPARATOR));
        }

        return newSearchParams;
      },
      { replace: true },
    );

  useEffect(() => {
    if (!isLegacyStatus) {
      return;
    }

    // The legacy value always maps to a selectable status, so there is always something
    // left to write back
    setSearchParams(
      currentSearchParams => {
        const newSearchParams = new URLSearchParams(currentSearchParams);
        newSearchParams.set(STATUS_PARAM_KEY, serializedStatuses);

        return newSearchParams;
      },
      { replace: true },
    );
  }, [isLegacyStatus, serializedStatuses, setSearchParams]);

  const setCategories = (newValues: string[]) =>
    setParamValues(CATEGORY_PARAM_KEY, newValues, selectableCategories);
  const setVenues = (newValues: string[]) =>
    setParamValues(VENUE_PARAM_KEY, newValues, selectableVenues);
  const setStatuses = (newValues: string[]) =>
    setParamValues(STATUS_PARAM_KEY, newValues, selectableStatuses);

  const reset = () => setSearchParams(deleteFilterSearchParams, { replace: true });

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
