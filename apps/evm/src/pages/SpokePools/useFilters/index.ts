import { useSearchParams } from 'react-router';
import type { SpokePool } from 'types';

import {
  COLLATERAL_PARAM_KEY,
  FILTER_PARAM_KEYS,
  LOAN_ASSET_PARAM_KEY,
  POOL_PARAM_KEY,
} from '../constants';

const PARAM_VALUE_SEPARATOR = ',';

export interface UseFiltersInput {
  spokePools: SpokePool[];
}

// Selecting from the option list rather than from the URL keeps unknown values out,
// deduplicates, and orders the selection the way the options are displayed
const parseParamValues = ({
  searchParams,
  key,
  selectableValues,
}: {
  searchParams: URLSearchParams;
  key: string;
  selectableValues: string[];
}) => {
  const paramValues = (searchParams.get(key) ?? '')
    .split(PARAM_VALUE_SEPARATOR)
    .map(value => value.trim())
    .filter(value => value.length > 0);

  return selectableValues.filter(selectableValue => paramValues.includes(selectableValue));
};

export const useFilters = ({ spokePools }: UseFiltersInput) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const loanAssetOptions = [
    ...new Set(
      spokePools.flatMap(spokePool =>
        spokePool.assets
          .filter(asset => asset.isBorrowable)
          .map(asset => asset.vToken.underlyingToken.symbol),
      ),
    ),
  ].map(symbol => ({ label: symbol, value: symbol }));

  const collateralOptions = [
    ...new Set(
      spokePools.flatMap(spokePool =>
        spokePool.assets
          .filter(asset => !asset.isBorrowable)
          .map(asset => asset.vToken.underlyingToken.symbol),
      ),
    ),
  ].map(symbol => ({ label: symbol, value: symbol }));

  const poolOptions = spokePools.map(spokePool => ({
    label: spokePool.name,
    value: spokePool.name,
  }));

  const selectableLoanAssets = loanAssetOptions.map(({ value }) => value);
  const selectableCollaterals = collateralOptions.map(({ value }) => value);
  const selectablePools = poolOptions.map(({ value }) => value);

  const loanAssets = parseParamValues({
    searchParams,
    key: LOAN_ASSET_PARAM_KEY,
    selectableValues: selectableLoanAssets,
  });

  const collaterals = parseParamValues({
    searchParams,
    key: COLLATERAL_PARAM_KEY,
    selectableValues: selectableCollaterals,
  });

  const pools = parseParamValues({
    searchParams,
    key: POOL_PARAM_KEY,
    selectableValues: selectablePools,
  });

  // Filter changes replace the current history entry rather than pushing a new one, so
  // going back leaves the page instead of stepping through every option that was toggled
  const setParamValues = (key: string, newValues: string[], selectableValues: string[]) =>
    setSearchParams(
      currentSearchParams => {
        const newSearchParams = new URLSearchParams(currentSearchParams);
        const orderedValues = selectableValues.filter(selectableValue =>
          newValues.includes(selectableValue),
        );

        if (orderedValues.length === 0) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, orderedValues.join(PARAM_VALUE_SEPARATOR));
        }

        return newSearchParams;
      },
      { replace: true },
    );

  const reset = () =>
    setSearchParams(
      currentSearchParams => {
        const newSearchParams = new URLSearchParams(currentSearchParams);
        FILTER_PARAM_KEYS.forEach(key => newSearchParams.delete(key));

        return newSearchParams;
      },
      { replace: true },
    );

  return {
    loanAssets,
    loanAssetOptions,
    setLoanAssets: (newValues: string[]) =>
      setParamValues(LOAN_ASSET_PARAM_KEY, newValues, selectableLoanAssets),
    collaterals,
    collateralOptions,
    setCollaterals: (newValues: string[]) =>
      setParamValues(COLLATERAL_PARAM_KEY, newValues, selectableCollaterals),
    pools,
    poolOptions,
    setPools: (newValues: string[]) => setParamValues(POOL_PARAM_KEY, newValues, selectablePools),
    reset,
  };
};
