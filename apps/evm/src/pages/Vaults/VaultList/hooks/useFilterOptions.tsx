import { Icon } from 'components';
import { useTranslation } from 'libs/translations';
import { useSearchParams } from 'react-router';

export const ALL_OPTION_VALUE = 'all';

const CATEGORY_PARAM_KEY = 'category';
const MANAGER_PARAM_KEY = 'manager';
const STATUS_PARAM_KEY = 'status';

export const useFilterOptions = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get(CATEGORY_PARAM_KEY) ?? ALL_OPTION_VALUE;
  const manager = searchParams.get(MANAGER_PARAM_KEY) ?? ALL_OPTION_VALUE;
  const status = searchParams.get(STATUS_PARAM_KEY) ?? ALL_OPTION_VALUE;

  const setCategory = (newVal: string) =>
    setSearchParams(currentSearchParams => ({
      ...Object.fromEntries(currentSearchParams),
      [CATEGORY_PARAM_KEY]: newVal,
    }));

  const setManager = (newVal: string) =>
    setSearchParams(currentSearchParams => ({
      ...Object.fromEntries(currentSearchParams),
      [MANAGER_PARAM_KEY]: newVal,
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
      label: t('vault.filter.stablecoins'),
      value: 'stablecoins',
    },
    {
      label: t('vault.filter.yieldTokens'),
      value: 'yieldTokens',
    },
    {
      label: t('vault.filter.others'),
      value: 'others',
    },
  ];
  const managerOptions = [
    {
      label: t('vault.filter.allManagers'),
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
          <Icon name="ceefu" />
          CEFFU
        </div>
      ),
      value: 'ceefu',
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

  return {
    category,
    setCategory,
    categoryOptions,
    manager,
    setManager,
    managerOptions,
    status,
    setStatus,
    statusOptions,
  };
};
