import { useQueries, QueryObserverOptions } from 'react-query';

import getHypotheticalAccountLiquidity from 'clients/api/queries/getHypotheticalAccountLiquidity';
import { useComptrollerContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';
import { Asset } from 'types';

type Options = QueryObserverOptions; // @TODO: add query specific generics

type VToken = {
  address: Asset['vtokenAddress'];
  balance: string;
};

const useGetHypotheticalLiquidityQueries = (
  {
    vTokens,
    accountAddress,
  }: {
    accountAddress: string;
    vTokens: VToken[];
  },
  options: Options = {},
) => {
  const comptrollerContract = useComptrollerContract();

  return useQueries(
    vTokens.map(vToken => {
      const formattedVTokenAddress = vToken.address.toLowerCase();
      const enabled = options.enabled !== undefined && !!vToken.balance;

      return {
        queryKey: [FunctionKey.GET_HYPOTHETICAL_LIQUIDITY, accountAddress, formattedVTokenAddress],
        queryFn: () =>
          getHypotheticalAccountLiquidity({
            comptrollerContract,
            accountAddress,
            vtokenAddress: formattedVTokenAddress,
            balanceOf: vToken.balance,
          }),
        ...options,
        enabled,
      };
    }),
  );
};

export default useGetHypotheticalLiquidityQueries;
