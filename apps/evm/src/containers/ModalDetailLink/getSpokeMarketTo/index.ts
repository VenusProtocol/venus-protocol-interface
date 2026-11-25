import { routes } from 'constants/routing';
import { SUB_TAB_PARAM_KEY, TAB_PARAM_KEY } from 'hooks/useTabs';
import type { To } from 'react-router';
import type { Address } from 'viem';

const collateralTabIds = ['supply', 'withdraw'];
const loanTabIds = ['borrow', 'repay'];

export const getSpokeMarketTo = ({
  spokePoolComptrollerAddress,
  spokeVTokenAddress,
  activeTabPath,
}: {
  spokePoolComptrollerAddress: Address;
  spokeVTokenAddress: Address;
  activeTabPath: string[];
}): To => {
  const [outerTabId, innerTabId] = activeTabPath;
  const searchParams = new URLSearchParams();

  if (outerTabId === 'collateral' || outerTabId === 'loan') {
    searchParams.set(TAB_PARAM_KEY, outerTabId);

    if (innerTabId) {
      searchParams.set(SUB_TAB_PARAM_KEY, innerTabId);
    }
  } else if (collateralTabIds.includes(outerTabId)) {
    searchParams.set(TAB_PARAM_KEY, 'collateral');
    searchParams.set(SUB_TAB_PARAM_KEY, outerTabId);
  } else if (loanTabIds.includes(outerTabId)) {
    searchParams.set(TAB_PARAM_KEY, 'loan');
    searchParams.set(SUB_TAB_PARAM_KEY, outerTabId);
  }

  return {
    pathname: routes.spokeMarket.path
      .replace(':spokePoolComptrollerAddress', spokePoolComptrollerAddress)
      .replace(':spokeVTokenAddress', spokeVTokenAddress),
    search: searchParams.toString(),
  };
};
