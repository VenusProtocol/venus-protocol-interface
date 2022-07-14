import { QueryClient } from 'react-query';

import MAX_UINT256 from 'constants/maxUint256';
import { GetAllowanceOutput } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { TokenId } from 'types';
import type { UseGetAllowanceQueryKey } from './useGetAllowance';

const setCachedTokenAllowanceToMax = ({
  queryClient,
  tokenId,
  spenderAddress,
  accountAddress,
}: {
  queryClient: QueryClient;
  tokenId: TokenId;
  spenderAddress: string;
  accountAddress: string;
}) => {
  const queryKey: UseGetAllowanceQueryKey = [
    FunctionKey.GET_TOKEN_ALLOWANCE,
    {
      tokenId,
      spenderAddress,
      accountAddress,
    },
  ];

  queryClient.setQueryData<GetAllowanceOutput>(queryKey, MAX_UINT256);
};

export default setCachedTokenAllowanceToMax;
