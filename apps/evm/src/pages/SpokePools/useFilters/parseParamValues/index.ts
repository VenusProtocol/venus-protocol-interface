import { PARAM_VALUE_SEPARATOR } from '../../constants';

export interface ParseParamValuesInput {
  searchParams: URLSearchParams;
  key: string;
  selectableValues: string[];
}

// Selecting from the option list rather than from the URL keeps unknown values out,
// deduplicates, and orders the selection the way the options are displayed
export const parseParamValues = ({
  searchParams,
  key,
  selectableValues,
}: ParseParamValuesInput) => {
  const paramValues = (searchParams.get(key) ?? '')
    .split(PARAM_VALUE_SEPARATOR)
    .map(value => value.trim())
    .filter(value => value.length > 0);

  return selectableValues.filter(selectableValue => paramValues.includes(selectableValue));
};
