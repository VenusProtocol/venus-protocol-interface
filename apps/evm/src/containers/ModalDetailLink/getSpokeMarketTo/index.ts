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
  let tabId: string | undefined;
  let subTabId: string | undefined;

  if (outerTabId === 'collateral' || outerTabId === 'loan') {
    tabId = outerTabId;
    subTabId = innerTabId;
  }

  if (collateralTabIds.includes(outerTabId)) {
    tabId = 'collateral';
    subTabId = outerTabId;
  }

  if (loanTabIds.includes(outerTabId)) {
    tabId = 'loan';
    subTabId = outerTabId;
  }

  const searchParams = new URLSearchParams();

  if (tabId) {
    searchParams.set(TAB_PARAM_KEY, tabId);
  }

  if (subTabId) {
    searchParams.set(SUB_TAB_PARAM_KEY, subTabId);
  }

  return {
    pathname: routes.spokeMarket.path
      .replace(':spokePoolComptrollerAddress', spokePoolComptrollerAddress)
      .replace(':spokeVTokenAddress', spokeVTokenAddress),
    search: searchParams.toString(),
  };
};
