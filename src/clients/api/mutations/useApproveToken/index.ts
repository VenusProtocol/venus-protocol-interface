import { useMutation, MutationObserverOptions } from 'react-query';

import MAX_UINT256 from 'constants/maxUint256';
import { TokenId } from 'types';
import {
  queryClient,
  approveToken,
  IApproveTokenInput,
  ApproveTokenOutput,
  GetAllowanceOutput,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useTokenContract } from 'clients/contracts/hooks';
import getSpenderAddress from './getSpenderAddress';

const useApproveToken = (
  { assetId }: { assetId: TokenId },
  // TODO: use custom error type https://app.clickup.com/t/2rvwhnt
  options?: MutationObserverOptions<
    ApproveTokenOutput,
    Error,
    Omit<IApproveTokenInput, 'tokenContract'>
  >,
) => {
  const tokenContract = useTokenContract(assetId);
  return useMutation(
    FunctionKey.APPROVE_TOKEN,
    params =>
      approveToken({
        tokenContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        // Update cached allowance value to MAX_UINT256
        const queryKey = [FunctionKey.GET_TOKEN_ALLOWANCE, assetId, getSpenderAddress(assetId)];
        queryClient.setQueryData<GetAllowanceOutput>(queryKey, `${MAX_UINT256}`);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useApproveToken;
