import { QueryObserverOptions, useQuery } from 'react-query';

import { GetVaiTreasuryPercentageOutput, getVaiTreasuryPercentage } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGetVaiControllerContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import { ChainId } from 'types';
import { callOrThrow } from 'utilities';

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
