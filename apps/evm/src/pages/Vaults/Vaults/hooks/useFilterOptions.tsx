import { Icon } from 'components';
import { useTranslation } from 'libs/translations';
import { useSearchParams } from 'react-router';

export const ALL_OPTION_VALUE = 'all';

const CATEGORY_PARAM_KEY = 'category';
const CURATOR_PARAM_KEY = 'curator';

export const useFilterOptions = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get(CATEGORY_PARAM_KEY) ?? ALL_OPTION_VALUE;
  const curator = searchParams.get(CURATOR_PARAM_KEY) ?? ALL_OPTION_VALUE;

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
      label: t('vault.filter.others'),
      value: 'others',
    },
  ];
  const curatorOptions = [
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
  ];

  return {
    category,
    setCategory,
    categoryOptions,
    curator,
    setCurator,
    curatorOptions,
  };
};
