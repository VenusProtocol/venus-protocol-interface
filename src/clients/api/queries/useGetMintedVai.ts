import { QueryObserverOptions, useQuery } from 'react-query';

import getMintedVai, {
  GetMintedVaiInput,
  GetMintedVaiOutput,
} from 'clients/api/queries/getMintedVai';
import { useComptrollerContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetMintedVaiOutput,
  Error,
  GetMintedVaiOutput,
  GetMintedVaiOutput,
  FunctionKey.GET_MINTED_VAI
>;

const useGetMintedVai = (
  { accountAddress }: Omit<GetMintedVaiInput, 'comptrollerContract'>,
  options?: Options,
) => {
  const comptrollerContract = useComptrollerContract();

  return useQuery(
    FunctionKey.GET_MINTED_VAI,
    () => getMintedVai({ accountAddress, comptrollerContract }),
    options,
  );
};

export default useGetMintedVai;
