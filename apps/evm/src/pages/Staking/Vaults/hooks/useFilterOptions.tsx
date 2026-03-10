import { Icon } from 'components';
import { useTranslation } from 'libs/translations';
import { useSearchParams } from 'react-router';
import type { Vault } from 'types';

export const ALL_OPTION_VALUE = 'all';

const CATEGORY_PARAM_KEY = 'category';
const CURATOR_PARAM_KEY = 'curator';
const STATUS_PARAM_KEY = 'status';

export const useFilterOptions = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get(CATEGORY_PARAM_KEY) ?? ALL_OPTION_VALUE;
  const curator = searchParams.get(CURATOR_PARAM_KEY) ?? ALL_OPTION_VALUE;
  const status = searchParams.get(STATUS_PARAM_KEY) ?? ALL_OPTION_VALUE;

  const setCategory = (newVal: string) =>
    setSearchParams(currentSearchParams => ({
      ...Object.fromEntries(currentSearchParams),
      [CATEGORY_PARAM_KEY]: newVal,
    }));

  const setCurator = (newVal: string) =>
    setSearchParams(currentSearchParams => ({
      ...Object.fromEntries(currentSearchParams),
      [CURATOR_PARAM_KEY]: newVal,
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
    {
      label: t('vault.filter.stables'),
      value: 'stables',
    },
    /*
    {
      label: t('vault.filter.rwa'),
      value: 'rwa',
    },
    {
      label: t('vault.filter.yieldTokens'),
      value: 'yieldTokens',
    },
    */
  ];
  const curatorOptions = [
    {
      label: t('vault.filter.manager'),
      value: ALL_OPTION_VALUE,
    },
    /*
    {
      label: (
        <div className="flex items-center gap-2">
          <Icon name="ceefu" />
          CEEFU
        </div>
      ),
      value: 'ceefu',
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
    */
    {
      label: (
        <div className="flex items-center gap-2">
          <Icon name="logoMobile" />
          Venus
        </div>
      ),
      value: 'venus',
    },
  ];
  const statusOptions = [
    {
      label: t('vault.filter.state'),
      value: ALL_OPTION_VALUE,
    },
    {
      label: t('vault.filter.deposit'),
      value: 'deposit',
    },
    {
      label: t('vault.filter.active'),
      value: 'active',
    },
    {
      label: t('vault.filter.refund'),
      value: 'refund',
    },
    {
      label: t('vault.filter.earning'),
      value: 'earning',
    },
    {
      label: t('vault.filter.repaying'),
      value: 'repaying',
    },
    {
      label: t('vault.filter.claim'),
      value: 'claim',
    },
  ];

  const getFilterProperties = (vault: Vault) => {
    let category = ALL_OPTION_VALUE;
    let curator = ALL_OPTION_VALUE;
    let status = ALL_OPTION_VALUE;

    if (vault.stakedToken.symbol === 'XVS') {
      category = 'others';
      curator = 'venus';
      status = vault.isPaused ? '' : 'active';
    } else if (vault.stakedToken.symbol === 'VAI') {
      category = 'stables';
      curator = 'venus';
      status = vault.isPaused ? '' : 'active';
    }

    return {
      category,
      curator,
      status,
    };
  };

  return {
    category,
    setCategory,
    categoryOptions,
    curator,
    setCurator,
    curatorOptions,
    status,
    setStatus,
    statusOptions,
    getFilterProperties,
  };
};
