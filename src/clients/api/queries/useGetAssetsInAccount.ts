import { useQuery, QueryObserverOptions } from 'react-query';

import getAssetsInAccount, {
  GetAssetsInAccountOutput,
  IGetAssetsInAccountInput,
} from 'clients/api/queries/getAssetsInAccount';
import { useComptrollerContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetAssetsInAccountOutput,
  Error,
  GetAssetsInAccountOutput,
  GetAssetsInAccountOutput,
  FunctionKey.GET_ASSETS_IN_ACCOUNT
>;

const useGetAssetsInAccount = (
  { account }: Omit<IGetAssetsInAccountInput, 'comptrollerContract'>,
  options?: Options,
) => {
  const comptrollerContract = useComptrollerContract();
  return useQuery(
    FunctionKey.GET_ASSETS_IN_ACCOUNT,
    () => getAssetsInAccount({ comptrollerContract, account }),
    options,
  );
};

export default useGetAssetsInAccount;
