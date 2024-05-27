import { type QueryObserverOptions, useQuery } from 'react-query';

import {
  type GetPoolLiquidationIncentiveInput,
  type GetPoolLiquidationIncentiveOutput,
  getPoolLiquidationIncentive,
} from 'clients/api/queries/getPoolLiquidationIncentive';
import FunctionKey from 'constants/functionKey';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import {
  useGetIsolatedPoolComptrollerContract,
  useGetLegacyPoolComptrollerContract,
} from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import { ChainId } from 'types';
import { areAddressesEqual, callOrThrow } from 'utilities';

interface TrimmedGetPoolLiquidationIncentiveInput
  extends Omit<GetPoolLiquidationIncentiveInput, 'poolComptrollerContract'> {
  poolComptrollerContractAddress: string;
}

export type UseGetPoolLiquidationIncentiveQueryKey = [
  FunctionKey.GET_POOL_LIQUIDATION_INCENTIVE,
  TrimmedGetPoolLiquidationIncentiveInput & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetPoolLiquidationIncentiveOutput,
  Error,
  GetPoolLiquidationIncentiveOutput,
  GetPoolLiquidationIncentiveOutput,
  UseGetPoolLiquidationIncentiveQueryKey
>;

export const useGetPoolLiquidationIncentive = (
  { poolComptrollerContractAddress }: TrimmedGetPoolLiquidationIncentiveInput,
  options?: Options,
) => {
  const { chainId } = useChainId();
  const { corePoolComptrollerContractAddress } = useGetChainMetadata();

  const legacyPoolComptrollerContract = useGetLegacyPoolComptrollerContract();
  const isolatedPoolComptrollerContract = useGetIsolatedPoolComptrollerContract({
    address: poolComptrollerContractAddress,
    passSigner: false,
  });

  const poolComptrollerContract =
    areAddressesEqual(corePoolComptrollerContractAddress, poolComptrollerContractAddress) &&
    (chainId === ChainId.BSC_MAINNET || chainId === ChainId.BSC_TESTNET)
      ? legacyPoolComptrollerContract
      : isolatedPoolComptrollerContract;

  return useQuery(
    [FunctionKey.GET_POOL_LIQUIDATION_INCENTIVE, { poolComptrollerContractAddress, chainId }],
    () => callOrThrow({ poolComptrollerContract }, getPoolLiquidationIncentive),
    options,
  );
};
