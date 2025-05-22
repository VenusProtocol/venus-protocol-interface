import type { TokenAction } from 'types';

export const isCollateralActionDisabled = ({
  disabledTokenActions,
  isCollateralOfUser,
}: {
  disabledTokenActions: TokenAction[];
  isCollateralOfUser: boolean;
}) => {
  let isEnterMarketActionDisabled = false;
  let isExitMarketActionDisabled = false;

  disabledTokenActions.forEach(disabledTokenAction => {
    if (disabledTokenAction === 'enterMarket') {
      isEnterMarketActionDisabled = true;
    }

    if (disabledTokenAction === 'exitMarket') {
      isExitMarketActionDisabled = true;
    }
  });

  // if the asset is a collateral, consider the exit market action
  // if not, consider the enter market action
  return isCollateralOfUser ? isExitMarketActionDisabled : isEnterMarketActionDisabled;
};
