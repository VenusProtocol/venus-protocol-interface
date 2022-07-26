import { QueryObserverOptions, useQuery } from 'react-query';

import getAssetsInAccount, {
  GetAssetsInAccountInput,
  GetAssetsInAccountOutput,
} from 'clients/api/queries/getAssetsInAccount';
import { useComptrollerContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetAssetsInAccountOutput,
  Error,
  GetAssetsInAccountOutput,
  GetAssetsInAccountOutput,
  [FunctionKey.GET_ASSETS_IN_ACCOUNT, Omit<GetAssetsInAccountInput, 'comptrollerContract'>]
>;

const useGetAssetsInAccount = (
  { accountAddress }: Omit<GetAssetsInAccountInput, 'comptrollerContract'>,
  options?: Options,
) => {
  const comptrollerContract = useComptrollerContract();

  return useQuery(
    [FunctionKey.GET_ASSETS_IN_ACCOUNT, { accountAddress }],
    () => getAssetsInAccount({ comptrollerContract, accountAddress }),
    options,
  );
};

export default useGetAssetsInAccount;
