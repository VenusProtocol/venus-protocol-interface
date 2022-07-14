import { QueryClient } from 'react-query';
import { TokenId } from 'types';
import { getTokenSpenderAddress } from 'utilities';

import { GetAllowanceOutput } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import MAX_UINT256 from 'constants/maxUint256';

import type { UseGetAllowanceQueryKey } from './useGetAllowance';

const setCachedTokenAllowanceToMax = ({
  queryClient,
  tokenId,
}: {
  queryClient: QueryClient;
  tokenId: TokenId;
}) => {
  const queryKey: UseGetAllowanceQueryKey = [
    FunctionKey.GET_TOKEN_ALLOWANCE,
    {
      spenderAddress: getTokenSpenderAddress(tokenId),
      tokenId,
    },
  ];

  queryClient.setQueryData<GetAllowanceOutput>(queryKey, MAX_UINT256);
};

export default setCachedTokenAllowanceToMax;
