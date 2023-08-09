import { MutationObserverOptions, useMutation } from 'react-query';
import { VToken } from 'types';
import { callOrThrow } from 'utilities';

import { queryClient } from 'clients/api';
import redeem, { RedeemInput, RedeemOutput } from 'clients/api/mutations/redeem';
import FunctionKey from 'constants/functionKey';
import useGetVTokenContract from 'hooks/useGetVTokenContract';

type TrimmedRedeemInput = Omit<RedeemInput, 'tokenContract' | 'accountAddress'>;
type Options = MutationObserverOptions<RedeemOutput, Error, TrimmedRedeemInput>;

const useRedeem = ({ vToken }: { vToken: VToken }, options?: Options) => {
  const tokenContract = useGetVTokenContract(vToken);

  return useMutation(
    FunctionKey.REDEEM,
    (input: TrimmedRedeemInput) =>
      callOrThrow({ tokenContract }, params =>
        redeem({
          ...params,
          ...input,
        }),
      ),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        const accountAddress = await tokenContract?.signer.getAddress();

        queryClient.invalidateQueries([
          FunctionKey.GET_V_TOKEN_BALANCE,
          {
            accountAddress,
            vTokenAddress: vToken.address,
          },
        ]);

        queryClient.invalidateQueries(FunctionKey.GET_V_TOKEN_BALANCES_ALL);
        queryClient.invalidateQueries(FunctionKey.GET_MAIN_MARKETS);
        queryClient.invalidateQueries(FunctionKey.GET_ISOLATED_POOLS);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useRedeem;
