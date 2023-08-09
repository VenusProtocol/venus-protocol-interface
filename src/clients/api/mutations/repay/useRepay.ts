import { MutationObserverOptions, useMutation } from 'react-query';
import { VToken } from 'types';
import { callOrThrow } from 'utilities';

import { RepayInput, RepayOutput, queryClient, repay } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';
import useGetUniqueContract from 'hooks/useGetUniqueContract';

type TrimmedRepayInput = Omit<RepayInput, 'signer' | 'vToken' | 'maximillionContract'>;
type Options = MutationObserverOptions<RepayOutput, Error, TrimmedRepayInput>;

const useRepay = ({ vToken }: { vToken: VToken }, options?: Options) => {
  const { signer, accountAddress } = useAuth();
  const maximillionContract = useGetUniqueContract({
    name: 'maximillion',
  });

  return useMutation(
    FunctionKey.REPAY,
    (input: TrimmedRepayInput) =>
      callOrThrow({ signer }, params =>
        repay({
          ...params,
          ...input,
          vToken,
          maximillionContract,
        }),
      ),
    {
      ...options,
      onSuccess: () => {
        queryClient.invalidateQueries(FunctionKey.GET_V_TOKEN_BALANCES_ALL);
        queryClient.invalidateQueries(FunctionKey.GET_MAIN_MARKETS);
        queryClient.invalidateQueries(FunctionKey.GET_ISOLATED_POOLS);

        queryClient.invalidateQueries([
          FunctionKey.GET_TOKEN_ALLOWANCE,
          {
            tokenAddress: vToken.underlyingToken.address,
            accountAddress,
          },
        ]);
      },
    },
  );
};

export default useRepay;
