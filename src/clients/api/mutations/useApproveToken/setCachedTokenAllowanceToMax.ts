import { QueryClient } from 'react-query';

import MAX_UINT256 from 'constants/maxUint256';
import { GetAllowanceOutput } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { TokenId } from 'types';
import { getTokenSpenderAddress } from 'utilities';

const setCachedTokenAllowanceToMax = ({
  queryClient,
  tokenId,
}: {
  queryClient: QueryClient;
  tokenId: TokenId;
}) => {
  const queryKey = [FunctionKey.GET_TOKEN_ALLOWANCE, tokenId, getTokenSpenderAddress(tokenId)];
  queryClient.setQueryData<GetAllowanceOutput>(queryKey, `${MAX_UINT256.toFixed()}`);
};

export default setCachedTokenAllowanceToMax;
