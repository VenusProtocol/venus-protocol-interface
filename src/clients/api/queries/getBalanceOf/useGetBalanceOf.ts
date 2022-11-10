import { QueryObserverOptions, useQuery } from 'react-query';

import { GetBalanceOfInput, GetBalanceOfOutput, getBalanceOf } from 'clients/api';
import { useWeb3 } from 'clients/web3';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetBalanceOfOutput,
  Error,
  GetBalanceOfOutput,
  GetBalanceOfOutput,
  [
    FunctionKey.GET_BALANCE_OF,
    {
      accountAddress: string;
      tokenAddress: string;
    },
  ]
>;

const useGetBalanceOf = (
  { accountAddress, token }: Omit<GetBalanceOfInput, 'web3'>,
  options?: Options,
) => {
  const web3 = useWeb3();

  return useQuery(
    [
      FunctionKey.GET_BALANCE_OF,
      {
        accountAddress,
        tokenAddress: token.address,
      },
    ],
    () => getBalanceOf({ web3, accountAddress, token }),
    options,
  );
};

export default useGetBalanceOf;
