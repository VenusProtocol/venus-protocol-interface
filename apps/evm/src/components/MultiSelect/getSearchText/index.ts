import type { MultiSelectOption } from '../types';

export const getSearchText = (option: MultiSelectOption) =>
  (
    option.searchText ?? (typeof option.label === 'string' ? option.label : option.value)
  ).toLowerCase();
