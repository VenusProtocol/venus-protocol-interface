import { getSearchText } from '../getSearchText';
import type { MultiSelectOption } from '../types';

// Starts-with matches first, then contains matches.
export const filterOptions = (options: MultiSelectOption[], query: string) => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return options;
  }

  const startsWithQuery = options.filter(option =>
    getSearchText(option).startsWith(normalizedQuery),
  );
  const containsQuery = options.filter(
    option =>
      !getSearchText(option).startsWith(normalizedQuery) &&
      getSearchText(option).includes(normalizedQuery),
  );

  return [...startsWithQuery, ...containsQuery];
};
