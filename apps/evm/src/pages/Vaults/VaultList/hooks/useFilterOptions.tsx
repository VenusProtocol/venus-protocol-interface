import { Icon } from 'components';
import { useTranslation } from 'libs/translations';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { VaultCategory, VaultStatus } from 'types';
import { getVaultCategoryName } from 'utilities/getVaultCategoryName';

import institutionIconSrc from '../asset/institution.svg';

export const ALL_OPTION_VALUE = 'all';

const CATEGORY_PARAM_KEY = 'category';
const VENUE_PARAM_KEY = 'venue';
const STATUS_PARAM_KEY = 'status';

const LEGACY_ACTIVE_STATUS_VALUE = 'active';

export const useFilterOptions = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get(CATEGORY_PARAM_KEY) ?? ALL_OPTION_VALUE;
  const venue = searchParams.get(VENUE_PARAM_KEY) ?? ALL_OPTION_VALUE;
  const statusParam = searchParams.get(STATUS_PARAM_KEY) ?? ALL_OPTION_VALUE;
  const isLegacyStatus = statusParam === LEGACY_ACTIVE_STATUS_VALUE;
  const status = isLegacyStatus ? VaultStatus.Deposit : statusParam;

  useEffect(() => {
    if (!isLegacyStatus) {
      return;
    }

    setSearchParams(
      currentSearchParams => ({
        ...Object.fromEntries(currentSearchParams),
        [STATUS_PARAM_KEY]: VaultStatus.Deposit,
      }),
      { replace: true },
    );
  }, [isLegacyStatus, setSearchParams]);

  const setCategory = (newVal: string) =>
    setSearchParams(currentSearchParams => ({
      ...Object.fromEntries(currentSearchParams),
      [CATEGORY_PARAM_KEY]: newVal,
    }));

  const setVenue = (newVal: string) =>
    setSearchParams(currentSearchParams => ({
      ...Object.fromEntries(currentSearchParams),
      [VENUE_PARAM_KEY]: newVal,
    }));

  const setStatus = (newVal: string) =>
    setSearchParams(currentSearchParams => ({
      ...Object.fromEntries(currentSearchParams),
      [STATUS_PARAM_KEY]: newVal,
    }));

  const categoryOptions = [
    {
      label: t('vault.filter.allCategories'),
      value: ALL_OPTION_VALUE,
    },
  ];

  Object.values(VaultCategory).forEach(category =>
    categoryOptions.push({
      label: getVaultCategoryName({
        category,
        t,
      }),
      value: category,
    }),
  );

  const venueOptions = [
    {
      label: t('vault.filter.allVenues'),
      value: ALL_OPTION_VALUE,
    },
    {
      label: (
        <div className="flex items-center gap-2">
          <Icon name="logoMobile" />
          Venus
        </div>
      ),
      value: 'venus',
    },
    {
      label: (
        <div className="flex items-center gap-2">
          <Icon name="pendle" />
          Pendle
        </div>
      ),
      value: 'pendle',
    },
    {
      label: (
        <div className="flex items-center gap-2">
          <img src={institutionIconSrc} className="size-4" alt="" />
          {t('vault.filter.institution')}
        </div>
      ),
      value: 'institution',
    },
  ];

  const statusOptions = [
    {
      label: t('vault.filter.allStates'),
      value: ALL_OPTION_VALUE,
    },
    {
      label: t('vault.filter.deposit'),
      value: 'deposit',
    },
    {
      label: t('vault.filter.refund'),
      value: 'refund',
    },
    {
      label: t('vault.filter.locked'),
      value: 'locked',
    },
    {
      label: t('vault.filter.repaying'),
      value: 'repaying',
    },
    {
      label: t('vault.filter.claim'),
      value: 'claim',
    },
    {
      label: t('vault.filter.pending'),
      value: 'pending',
    },
    {
      label: t('vault.filter.paused'),
      value: 'paused',
    },
    {
      label: t('vault.filter.liquidated'),
      value: 'liquidated',
    },
    {
      label: t('vault.filter.inactive'),
      value: 'inactive',
    },
  ];

  return {
    category,
    setCategory,
    categoryOptions,
    venue,
    setVenue,
    venueOptions,
    status,
    setStatus,
    statusOptions,
  };
};
