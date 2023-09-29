import { useGetMainPoolComptrollerContract } from 'packages/contracts';
import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import getMintedVai, {
  GetMintedVaiInput,
  GetMintedVaiOutput,
} from 'clients/api/queries/getMintedVai';
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
  const mainPoolComptrollerContract = useGetMainPoolComptrollerContract();

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
