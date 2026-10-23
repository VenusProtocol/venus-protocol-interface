import { PARAM_VALUE_SEPARATOR } from '../../constants';

export interface ParseParamValuesInput {
  searchParams: URLSearchParams;
  key: string;
  selectableValues: string[];
}

// Pick from the options to drop unknowns, dedupe and order
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
