import { TAB_PARAM_KEY } from 'hooks/useTabs';
import { useSearchParams } from 'react-router';
import type { SpokeAsset } from 'types';

export const COLLATERAL_PARAM_KEY = 'collateral';

export interface UseSelectedSpokeCollateralInput {
  collaterals: SpokeAsset[];
}

export interface UseSelectedSpokeCollateralOutput {
  selectedCollateral?: SpokeAsset;
  selectCollateral: (collateral: SpokeAsset) => void;
}

// Kept in the URL so page and header share it
export const useSelectedSpokeCollateral = ({
  collaterals,
}: UseSelectedSpokeCollateralInput): UseSelectedSpokeCollateralOutput => {
  const [searchParams, setSearchParams] = useSearchParams();

  const collateralParamValue = searchParams.get(COLLATERAL_PARAM_KEY);
  const selectedCollateral = collaterals.find(
    ({ vToken }) => vToken.address.toLowerCase() === collateralParamValue?.toLowerCase(),
  );

  const selectCollateral = (collateral: SpokeAsset) =>
    setSearchParams(
      currentSearchParams => {
        const newSearchParams = new URLSearchParams(currentSearchParams);
        newSearchParams.set(COLLATERAL_PARAM_KEY, collateral.vToken.address);
        newSearchParams.set(TAB_PARAM_KEY, 'collateral');

        return newSearchParams;
      },
      { replace: true },
    );

  return { selectedCollateral, selectCollateral };
};
