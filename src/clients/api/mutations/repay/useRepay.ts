import { useGetMaximillionContract } from 'packages/contracts';
import { MutationObserverOptions, useMutation } from 'react-query';
import { VToken } from 'types';
import { callOrThrow, convertWeiToTokens } from 'utilities';

import { RepayInput, RepayOutput, queryClient, repay } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useAnalytics } from 'context/Analytics';
import { useAuth } from 'context/AuthContext';

type TrimmedRepayInput = Omit<RepayInput, 'signer' | 'vToken' | 'maximillionContract'>;
type Options = MutationObserverOptions<RepayOutput, Error, TrimmedRepayInput>;

const useRepay = (
  { vToken, poolName }: { vToken: VToken; poolName: string },
  options?: Options,
) => {
  const { signer, accountAddress } = useAuth();
  const { captureAnalyticEvent } = useAnalytics();
  const maximillionContract = useGetMaximillionContract({
    passSigner: true,
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
      onSuccess: async (...onSuccessParams) => {
        const { amountWei, isRepayingFullLoan } = onSuccessParams[1];

        captureAnalyticEvent('Tokens repaid', {
          poolName,
          tokenSymbol: vToken.underlyingToken.symbol,
          tokenAmountTokens: convertWeiToTokens({
            token: vToken.underlyingToken,
            valueWei: amountWei,
          }).toNumber(),
          repaidFullLoan: isRepayingFullLoan,
        });

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
