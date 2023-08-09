import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import getMainAssetsInAccount, {
  GetMainAssetsInAccountInput,
  GetMainAssetsInAccountOutput,
} from 'clients/api/queries/getMainAssetsInAccount';
import { useGetUniqueContract } from 'clients/contracts';
import FunctionKey from 'constants/functionKey';

type TrimmedGetMainAssetsInAccountOutput = Omit<
  GetMainAssetsInAccountInput,
  'mainPoolComptrollerContract'
>;

type Options = QueryObserverOptions<
  GetMainAssetsInAccountOutput,
  Error,
  GetMainAssetsInAccountOutput,
  GetMainAssetsInAccountOutput,
  [FunctionKey.GET_MAIN_ASSETS_IN_ACCOUNT, TrimmedGetMainAssetsInAccountOutput]
>;

const useGetMainAssetsInAccount = (
  input: TrimmedGetMainAssetsInAccountOutput,
  options?: Options,
) => {
  const mainPoolComptrollerContract = useGetUniqueContract({
    name: 'mainPoolComptroller',
  });

  return useQuery(
    [FunctionKey.GET_MAIN_ASSETS_IN_ACCOUNT, input],
    () =>
      callOrThrow({ mainPoolComptrollerContract }, params =>
        getMainAssetsInAccount({ ...params, ...input }),
      ),
    options,
  );
};

export default useGetMainAssetsInAccount;
