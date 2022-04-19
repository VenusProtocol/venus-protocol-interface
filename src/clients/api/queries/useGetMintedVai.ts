import { useQuery, QueryObserverOptions } from 'react-query';

import getMintedVai, { GetMintedVaiOutput } from 'clients/api/queries/getMintedVai';
import FunctionKey from 'constants/functionKey';
import { useComptrollerContract } from 'clients/contracts/hooks';

type Options = QueryObserverOptions<
  GetMintedVaiOutput,
  Error,
  GetMintedVaiOutput,
  GetMintedVaiOutput,
  FunctionKey.GET_MINTED_VAI
>;

const useGetMintedVai = (accountAddress: string, options?: Options) => {
  const comptrollerContract = useComptrollerContract();

  return useQuery(
    FunctionKey.GET_MINTED_VAI,
    () => getMintedVai({ accountAddress, comptrollerContract }),
    options,
  );
};

export default useGetMintedVai;
