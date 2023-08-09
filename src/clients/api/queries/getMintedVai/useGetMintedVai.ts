import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import getMintedVai, {
  GetMintedVaiInput,
  GetMintedVaiOutput,
} from 'clients/api/queries/getMintedVai';
import { useGetUniqueContract } from 'clients/contracts';
import FunctionKey from 'constants/functionKey';

type TrimmedGetMintedVaiOutput = Omit<GetMintedVaiInput, 'mainPoolComptrollerContract'>;
type Options = QueryObserverOptions<
  GetMintedVaiOutput,
  Error,
  GetMintedVaiOutput,
  GetMintedVaiOutput,
  [FunctionKey.GET_MINTED_VAI, TrimmedGetMintedVaiOutput]
>;

const useGetMintedVai = (input: TrimmedGetMintedVaiOutput, options?: Options) => {
  const mainPoolComptrollerContract = useGetUniqueContract({
    name: 'mainPoolComptroller',
  });

  return useQuery(
    [FunctionKey.GET_MINTED_VAI, input],
    () =>
      callOrThrow({ mainPoolComptrollerContract }, params =>
        getMintedVai({
          ...params,
          ...input,
        }),
      ),
    options,
  );
};

export default useGetMintedVai;
