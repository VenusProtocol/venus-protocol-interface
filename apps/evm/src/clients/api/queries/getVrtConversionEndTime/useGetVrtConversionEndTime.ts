import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import {
  type GetVrtConversionEndTimeOutput,
  getVrtConversionEndTime,
} from 'clients/api/queries/getVrtConversionEndTime';
import FunctionKey from 'constants/functionKey';
import { getVrtConverterContractAddress } from 'libs/contracts';
import { usePublicClient } from 'libs/wallet';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';

export type UseGetVrtConversionEndTimeQueryIndex = [
  FunctionKey.GET_VRT_CONVERSION_END_TIME,
  { chainId: ChainId },
];

type Options = QueryObserverOptions<
  GetVrtConversionEndTimeOutput,
  Error,
  GetVrtConversionEndTimeOutput,
  GetVrtConversionEndTimeOutput,
  UseGetVrtConversionEndTimeQueryIndex
>;

export const useGetVrtConversionEndTime = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();
  const vrtConverterAddress = getVrtConverterContractAddress({
    chainId,
  });

  return useQuery({
    queryKey: [FunctionKey.GET_VRT_CONVERSION_END_TIME, { chainId }],
    queryFn: () =>
      callOrThrow({ publicClient, vrtConverterAddress }, params =>
        getVrtConversionEndTime({ ...params }),
      ),
    ...options,
    enabled: !!vrtConverterAddress && (options?.enabled === undefined || options?.enabled),
  });
};
