import { useGetVaiControllerContract } from 'packages/contracts';
import { useChainId } from 'packages/wallet';
import { QueryObserverOptions, useQuery } from 'react-query';
import { ChainId } from 'types';
import { callOrThrow } from 'utilities';

import { GetVaiTreasuryPercentageOutput, getVaiTreasuryPercentage } from 'clients/api';
import FunctionKey from 'constants/functionKey';

export type UseGetVaiTreasuryPercentageQueryKey = [
  FunctionKey.GET_VAI_TREASURY_PERCENTAGE,
  { chainId: ChainId },
];

type Options = QueryObserverOptions<
  GetVaiTreasuryPercentageOutput | undefined,
  Error,
  GetVaiTreasuryPercentageOutput | undefined,
  GetVaiTreasuryPercentageOutput | undefined,
  UseGetVaiTreasuryPercentageQueryKey
>;

const useGetVaiTreasuryPercentage = (options?: Options) => {
  const { chainId } = useChainId();
  const vaiControllerContract = useGetVaiControllerContract();

  return useQuery(
    [FunctionKey.GET_VAI_TREASURY_PERCENTAGE, { chainId }],
    () => callOrThrow({ vaiControllerContract }, getVaiTreasuryPercentage),
    options,
  );
};

export default useGetVaiTreasuryPercentage;
