import { Icon, type SelectOption } from 'components';
import { useTranslation } from 'libs/translations';
import { useSearchParams } from 'react-router';

const ALL_OPTION_VALUE = 'all';

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

  const allOption: SelectOption<string> = {
    label: t('vault.filter.all'),
    value: 'all',
  };

  const categoryOptions = [
    allOption,
    {
      label: t('vault.filter.stables'),
      value: 'stables',
    },
    {
      label: t('vault.filter.rwa'),
      value: 'rwa',
    },
    {
      label: t('vault.filter.yieldTokens'),
      value: 'yieldTokens',
    },
  ];
  const curatorOptions = [
    allOption,
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
          <Icon name="ceefu" />
          Pendle
        </div>
      ),
      value: 'pendle',
    },
    {
      label: (
        <div className="flex items-center gap-2">
          <Icon name="ceefu" />
          Venus
        </div>
      ),
      value: 'venus',
    },
  ];
  const statusOptions = [
    allOption,
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
    curator,
    setCurator,
    curatorOptions,
    status,
    setStatus,
    statusOptions,
  };
};
