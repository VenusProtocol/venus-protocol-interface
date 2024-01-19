import { QueryObserverOptions, useQuery } from 'react-query';

import getMintedVai, {
  GetMintedVaiInput,
  GetMintedVaiOutput,
} from 'clients/api/queries/getMintedVai';
import FunctionKey from 'constants/functionKey';
import { useGetLegacyPoolComptrollerContract } from 'packages/contracts';
import { useChainId } from 'packages/wallet';
import { ChainId } from 'types';
import { callOrThrow } from 'utilities';

type TrimmedGetMintedVaiOutput = Omit<GetMintedVaiInput, 'legacyPoolComptrollerContract'>;

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
  const { chainId } = useChainId();
  const legacyPoolComptrollerContract = useGetLegacyPoolComptrollerContract();

  return useQuery(
    [FunctionKey.GET_MINTED_VAI, { ...input, chainId }],
    () =>
      callOrThrow({ legacyPoolComptrollerContract }, params =>
        getMintedVai({
          ...params,
          ...input,
        }),
      ),
    options,
  );
};

export default useGetMintedVai;
