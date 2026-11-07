import { PAGE_PARAM_DEFAULT_KEY } from 'hooks/useUrlPagination';

import { FILTER_PARAM_KEYS } from '../../constants';

export const deleteFilterSearchParams = (currentSearchParams: URLSearchParams) => {
  const newSearchParams = new URLSearchParams(currentSearchParams);
  FILTER_PARAM_KEYS.forEach(key => newSearchParams.delete(key));
  newSearchParams.delete(PAGE_PARAM_DEFAULT_KEY);

  return newSearchParams;
};
