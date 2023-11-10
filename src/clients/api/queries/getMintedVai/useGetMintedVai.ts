import { useGetMainPoolComptrollerContract } from 'packages/contracts';
import { QueryObserverOptions, useQuery } from 'react-query';
import { ChainId } from 'types';
import { callOrThrow } from 'utilities';

import getMintedVai, {
  GetMintedVaiInput,
  GetMintedVaiOutput,
} from 'clients/api/queries/getMintedVai';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';

type TrimmedGetMintedVaiOutput = Omit<GetMintedVaiInput, 'mainPoolComptrollerContract'>;

export type UseGetMintedVaiQueryKey = [
  FunctionKey.GET_MINTED_VAI,
  TrimmedGetMintedVaiOutput & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetMintedVaiOutput,
  Error,
  GetMintedVaiOutput,
  GetMintedVaiOutput,
  UseGetMintedVaiQueryKey
>;

const useGetMintedVai = (input: TrimmedGetMintedVaiOutput, options?: Options) => {
  const { chainId } = useAuth();
  const mainPoolComptrollerContract = useGetMainPoolComptrollerContract();

  return useQuery(
    [FunctionKey.GET_MINTED_VAI, { ...input, chainId }],
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
