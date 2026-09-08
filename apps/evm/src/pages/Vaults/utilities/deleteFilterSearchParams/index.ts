import { FILTER_PARAM_KEYS } from '../../constants';

export const deleteFilterSearchParams = (currentSearchParams: URLSearchParams) => {
  const newSearchParams = new URLSearchParams(currentSearchParams);
  FILTER_PARAM_KEYS.forEach(key => newSearchParams.delete(key));

  return newSearchParams;
};
