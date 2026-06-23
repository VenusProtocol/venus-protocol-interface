import type BigNumber from 'bignumber.js';
import type { Address } from 'viem';

import {
  legacyPoolComptrollerAbi,
  primeAbi,
  primeV2Abi,
  resilientOracleAbi,
  vaiControllerAbi,
} from 'libs/contracts';
import type { Asset, TokenBalance } from 'types';
import type { GetPoolsInput, GetPoolsOutput, PrimeApy, VTokenBalance } from '../../types';
import { appendPrimeSimulationDistributions } from './appendPrimeSimulationDistributions';
import { formatOutput } from './formatOutput';
import { type ApiTokenMetadata, getApiPools } from './getApiPools';
import { getUserCollateralAddresses } from './getUserCollateralAddresses';
import { getUserPrimeApys } from './getUserPrimeApys';
import { getUserTokenBalances } from './getUserTokenBalances';
import { getUserVaiBorrowBalance } from './getUserVaiBorrowBalance';

export interface GetPoolsQueryOutput extends GetPoolsOutput {
  tokenMetadataMapping: Record<string, ApiTokenMetadata>;
}

export const getPools = async ({
  publicClient,
  chainId,
  accountAddress,
  primeV1ContractAddress,
  primeV2ContractAddress,
  primeV2LensContractAddress,
  primeVersion,
  poolLensContractAddress,
  legacyPoolComptrollerContractAddress,
  vaiControllerContractAddress,
  resilientOracleContractAddress,
  venusLensContractAddress,
  tokens,
  isEModeFeatureEnabled,
}: GetPoolsInput): Promise<GetPoolsQueryOutput> => {
  const vai = tokens.find(token => token.symbol === 'VAI');

  const [
    apiPoolsResult,
    currentBlockNumberResult,
    unsafePrimeV1VTokenAddressesResult,
    unsafePrimeV2VTokenAddressesResult,
    userPrimeV1TokenResult,
    userPrimeV2TokenResult,
    vaiPriceMantissaResult,
    vaiRepayRateMantissaResult,
  ] = await Promise.all([
    getApiPools({ chainId }),
    // Fetch current block number
    publicClient.getBlockNumber(),
    // Prime related calls
    primeVersion === 1 && primeV1ContractAddress
      ? publicClient.readContract({
          abi: primeAbi,
          address: primeV1ContractAddress,
          functionName: 'getAllMarkets',
        }) // TODO: get from API
      : undefined,
    primeVersion === 2 && primeV2ContractAddress
      ? publicClient.readContract({
          abi: primeV2Abi,
          address: primeV2ContractAddress,
          functionName: 'getAllMarkets',
        }) // TODO: get from API
      : undefined,
    accountAddress && primeVersion === 1 && primeV1ContractAddress
      ? publicClient.readContract({
          abi: primeAbi,
          address: primeV1ContractAddress,
          functionName: 'tokens',
          args: [accountAddress],
        })
      : undefined,
    accountAddress && primeVersion === 2 && primeV2ContractAddress
      ? publicClient.readContract({
          abi: primeV2Abi,
          address: primeV2ContractAddress,
          functionName: 'isPrimeHolder',
          args: [accountAddress],
        })
      : undefined,
    // VAI related calls
    resilientOracleContractAddress && vai
      ? publicClient.readContract({
          address: resilientOracleContractAddress,
          abi: resilientOracleAbi,
          functionName: 'getPrice',
          args: [vai.address],
        })
      : undefined,
    vaiControllerContractAddress
      ? publicClient.readContract({
          address: vaiControllerContractAddress,
          abi: vaiControllerAbi,
          functionName: 'getVAIRepayRate',
        })
      : undefined,
  ]);

  const primeVTokenAddresses =
    (primeVersion === 1
      ? unsafePrimeV1VTokenAddressesResult
      : unsafePrimeV2VTokenAddressesResult) ?? [];

  const isUserPrimeV1 = userPrimeV1TokenResult?.[0] ?? false;
  const isUserPrimeV2 = !!userPrimeV2TokenResult;
  const isUserPrime = primeVersion === 1 ? isUserPrimeV1 : isUserPrimeV2;

  let userCollateralVTokenAddresses: string[] | undefined;
  let userTokenBalances: TokenBalance[] | undefined;
  let userVTokenBalances: VTokenBalance[] | undefined;
  let userVaiBorrowBalanceMantissa: BigNumber | undefined;
  let userPrimeApyMap: Map<string, PrimeApy> | undefined;
  let userLegacyPoolEModeGroupId: number | undefined;

  if (accountAddress) {
    const [
      userCollaterals,
      userBalances,
      userVaiBorrowBalance,
      userPrimeV1Apys,
      userPrimeV2Apys,
      userLegacyPoolEModeGroupIdResult,
    ] = await Promise.all([
      getUserCollateralAddresses({
        chainId,
        accountAddress,
        legacyPoolComptrollerContractAddress,
        apiPools: apiPoolsResult.pools,
        publicClient,
      }),
      getUserTokenBalances({
        accountAddress,
        apiPools: apiPoolsResult.pools,
        chainId,
        tokens,
        publicClient,
        poolLensContractAddress,
        venusLensContractAddress,
      }),
      vaiControllerContractAddress
        ? getUserVaiBorrowBalance({
            accountAddress,
            publicClient,
            vaiControllerContractAddress,
          })
        : undefined,
      isUserPrime && primeVersion === 1 && primeV1ContractAddress
        ? getUserPrimeApys({
            accountAddress,
            publicClient,
            primeVersion,
            primeContractAddress: primeV1ContractAddress,
            primeVTokenAddresses,
          })
        : undefined,
      isUserPrime && primeVersion === 2 && primeV2LensContractAddress
        ? getUserPrimeApys({
            accountAddress,
            publicClient,
            primeVersion,
            primeContractAddress: primeV2LensContractAddress,
            primeVTokenAddresses,
          })
        : undefined,
      isEModeFeatureEnabled && legacyPoolComptrollerContractAddress
        ? publicClient.readContract({
            abi: legacyPoolComptrollerAbi,
            address: legacyPoolComptrollerContractAddress,
            functionName: 'userPoolId',
            args: [accountAddress],
          })
        : undefined,
    ]);

    userCollateralVTokenAddresses = userCollaterals.userCollateralAddresses;
    userVTokenBalances = userBalances.userVTokenBalances;
    userTokenBalances = userBalances.userTokenBalances;
    userVaiBorrowBalanceMantissa = userVaiBorrowBalance?.userVaiBorrowBalanceMantissa;
    userPrimeApyMap =
      primeVersion === 1 ? userPrimeV1Apys?.userPrimeApyMap : userPrimeV2Apys?.userPrimeApyMap;
    userLegacyPoolEModeGroupId = userLegacyPoolEModeGroupIdResult
      ? Number(userLegacyPoolEModeGroupIdResult)
      : undefined;
  }

  const userPoolEModeGroupIdMapping: Record<Address, number> = {};

  // E-mode groups are currently only enabled on the legacy Core Pool
  if (userLegacyPoolEModeGroupId && legacyPoolComptrollerContractAddress) {
    userPoolEModeGroupIdMapping[legacyPoolComptrollerContractAddress.toLowerCase() as Address] =
      userLegacyPoolEModeGroupId;
  }

  const pools = formatOutput({
    chainId,
    isUserConnected: !!accountAddress,
    tokens,
    currentBlockNumber: currentBlockNumberResult,
    apiPools: apiPoolsResult.pools,
    tokenMetadataMapping: apiPoolsResult.tokenMetadataMapping,
    userPrimeApyMap,
    userCollateralVTokenAddresses,
    userVTokenBalances,
    userTokenBalances,
    userVaiBorrowBalanceMantissa,
    userPoolEModeGroupIdMapping,
    vaiRepayRateMantissa: vaiRepayRateMantissaResult,
    vaiPriceMantissa: vaiPriceMantissaResult,
  });

  // Add Prime simulations
  // TODO: get Prime simulations from API
  const xvs = tokens.find(token => token.symbol === 'XVS');

  const primeContractAddress =
    primeVersion === 1 ? primeV1ContractAddress : primeV2LensContractAddress;

  if (primeContractAddress && typeof primeVersion === 'number' && xvs) {
    await appendPrimeSimulationDistributions({
      assets: pools.reduce<Asset[]>((acc, pool) => acc.concat(pool.assets), []),
      primeContractAddress,
      primeVersion,
      primeVTokenAddresses,
      xvs,
      chainId,
      publicClient,
    });
  }

  const output: GetPoolsQueryOutput = {
    pools,
    tokenMetadataMapping: apiPoolsResult.tokenMetadataMapping,
  };

  return output;
};
