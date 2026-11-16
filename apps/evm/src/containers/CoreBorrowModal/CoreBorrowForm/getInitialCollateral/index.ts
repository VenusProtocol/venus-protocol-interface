import type { Asset } from 'types';
import { areTokensEqual } from 'utilities';

export const getInitialCollateral = ({
  collaterals,
  preselectedCollateral,
}: {
  collaterals: Asset[];
  preselectedCollateral?: Asset;
}) =>
  collaterals.find(
    collateral =>
      !!preselectedCollateral && areTokensEqual(collateral.vToken, preselectedCollateral.vToken),
  ) ??
  collaterals.find(collateral => !collateral.disabledTokenActions.includes('supply')) ??
  collaterals[0];
