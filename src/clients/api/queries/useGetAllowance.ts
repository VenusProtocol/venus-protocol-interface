import { useQuery, QueryObserverOptions } from 'react-query';

import getAllowance, {
  IGetAllowanceInput,
  GetAllowanceOutput,
} from 'clients/api/queries/getAllowance';
import FunctionKey from 'constants/functionKey';
import { useTokenContract } from 'clients/contracts/hooks';
import { TokenId } from 'types';

type Options = QueryObserverOptions<
  GetAllowanceOutput,
  Error,
  GetAllowanceOutput,
  GetAllowanceOutput,
  FunctionKey.GET_TOKEN_ALLOWANCE
>;

const useGetAllowance = (
  {
    accountAddress,
    spenderAddress,
    tokenId,
  }: Omit<IGetAllowanceInput, 'tokenContract'> & { tokenId: TokenId },
  options?: Options,
) => {
  const tokenContract = useTokenContract(tokenId);

  return useQuery(
    FunctionKey.GET_TOKEN_ALLOWANCE,
    () => getAllowance({ tokenContract, accountAddress, spenderAddress }),
    options,
  );
};

export default useGetAllowance;
