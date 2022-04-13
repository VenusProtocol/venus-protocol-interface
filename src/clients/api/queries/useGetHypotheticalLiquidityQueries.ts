import { useQueries, QueryObserverOptions } from 'react-query';

import getHypotheticalAccountLiquidity from 'clients/api/queries/getHypotheticalAccountLiquidity';
import { IGetVTokenBalancesAllOutput } from 'clients/api';
import { useComptroller } from 'clients/contracts/contractHooks';
import FunctionKey from 'constants/functionKey';
import { Asset } from 'types';

type Options = QueryObserverOptions; // @TODO: add query specific generics

const useGetHypotheticalLiquidityQueries = (
  {
    assetList,
    account,
    balances,
  }: {
    account: string | null | undefined;
    assetList: Asset[];
    balances: Record<string, IGetVTokenBalancesAllOutput[number]>;
  },
  options: Options = {},
) => {
  const comptrollerContract = useComptroller();
  return useQueries(
    assetList.map((asset: Asset) => {
      const enabled =
        options.enabled === undefined
          ? true
          : balances[asset.vtokenAddress.toLowerCase()]?.balanceOf !== undefined;
      return {
        queryKey: [FunctionKey.GET_HYPOTHETICAL_LIQUIDITY, account, asset.name],
        queryFn: () =>
          getHypotheticalAccountLiquidity({
            comptrollerContract,
            account,
            vtokenAddress: asset.vtokenAddress,
            balanceOf: balances[asset.vtokenAddress.toLowerCase()]?.balanceOf,
          }),
        ...options,
        enabled,
      };
    }),
  );
};

export default useGetHypotheticalLiquidityQueries;
