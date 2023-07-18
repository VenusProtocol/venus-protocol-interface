import { QueryObserverOptions, useQuery } from 'react-query';
import { getContractAddress } from 'utilities';

import getMintedVai, {
  GetMintedVaiInput,
  GetMintedVaiOutput,
} from 'clients/api/queries/getMintedVai';
import { useComptrollerContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

const mainPoolComptrollerAddress = getContractAddress('comptroller');

type Options = QueryObserverOptions<
  GetMintedVaiOutput,
  Error,
  GetMintedVaiOutput,
  GetMintedVaiOutput,
  [FunctionKey.GET_MINTED_VAI, { accountAddress: string }]
>;

const useGetMintedVai = (
  { accountAddress }: Omit<GetMintedVaiInput, 'comptrollerContract'>,
  options?: Options,
) => {
  const comptrollerContract = useComptrollerContract(mainPoolComptrollerAddress);

  return useQuery(
    [FunctionKey.GET_MINTED_VAI, { accountAddress }],
    () => getMintedVai({ accountAddress, comptrollerContract }),
    options,
  );
};

export default useGetMintedVai;
