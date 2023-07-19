import { abi as comptrollerAbi } from '@venusprotocol/isolated-pools/artifacts/contracts/Comptroller.sol/Comptroller.json';
import { abi as poolLensAbi } from '@venusprotocol/isolated-pools/artifacts/contracts/Lens/PoolLens.sol/PoolLens.json';
import { abi as rewardsDistributorAbi } from '@venusprotocol/isolated-pools/artifacts/contracts/Rewards/RewardsDistributor.sol/RewardsDistributor.json';
import { abi as resilientOracleAbi } from '@venusprotocol/oracle/artifacts/contracts/ResilientOracle.sol/ResilientOracle.json';
import {
  ContractCallContext,
  ContractCallResults,
  ContractCallReturnContext,
} from 'ethereum-multicall';
import _cloneDeep from 'lodash/cloneDeep';
import { Token } from 'types';
import {
  areTokensEqual,
  getContractAddress,
  getTokenByAddress,
  getVTokenByAddress,
} from 'utilities';

import { getIsolatedPoolParticipantsCount } from 'clients/subgraph';
import { logError } from 'context/ErrorLogger';

import getTokenBalances, { GetTokenBalancesOutput } from '../getTokenBalances';
import formatOutput from './formatOutput';
import { GetIsolatedPoolsInput, GetIsolatedPoolsOutput } from './types';

export type { GetIsolatedPoolsInput, GetIsolatedPoolsOutput } from './types';

const POOL_REGISTRY_ADDRESS = getContractAddress('PoolRegistry_Proxy'); // TODO: get from package (see VEN-1746)
const RESILIENT_ORACLE_ADDRESS = getContractAddress('oracle'); // TODO: get from package (see VEN-1746)

const getIsolatedPools = async ({
  accountAddress,
  poolLensContract,
  provider,
  multicall,
}: GetIsolatedPoolsInput): Promise<GetIsolatedPoolsOutput> => {
  const [poolsResults, poolParticipantsCountResult] = await Promise.all([
    // Fetch all pools
    poolLensContract.getAllPools(POOL_REGISTRY_ADDRESS),
    // Fetch borrower and supplier counts of each isolated token
    getIsolatedPoolParticipantsCount(),
  ]);

  // Extract vToken addresses and their associated underlying tokens
  const [vTokenAddresses, underlyingTokens] = poolsResults.reduce<[string[], Token[]]>(
    (acc, poolResult) => {
      const newVTokenAddresses: string[] = [];
      const newUnderlyingTokens: Token[] = [];

      poolResult.vTokens.forEach(vToken => {
        if (!newVTokenAddresses.includes(vToken.vToken)) {
          newVTokenAddresses.push(vToken.vToken);
        }

        const underlyingToken = getTokenByAddress(vToken.underlyingAssetAddress);

        if (!underlyingToken) {
          logError(`Record missing for underlying token: ${vToken.underlyingAssetAddress}`);
        } else if (!newUnderlyingTokens.some(token => areTokensEqual(token, underlyingToken))) {
          newUnderlyingTokens.push(underlyingToken);
        }
      });

      return [acc[0].concat(newVTokenAddresses), acc[1].concat(newUnderlyingTokens)];
    },
    [[], []],
  );

  // Fetch addresses of reward distributors and user collaterals
  const comptrollerCallsContext: ContractCallContext[] = poolsResults.map(result => {
    const calls: ContractCallContext['calls'] = [
      {
        reference: 'getRewardDistributors',
        methodName: 'getRewardDistributors',
        methodParameters: [],
      },
    ];

    if (accountAddress) {
      calls.push({
        reference: 'getAssetsIn',
        methodName: 'getAssetsIn(address)',
        methodParameters: [accountAddress],
      });
    }

    return {
      reference: result.comptroller,
      contractAddress: result.comptroller,
      abi: comptrollerAbi,
      calls,
    };
  });

  const multicallContexts: ContractCallContext[] = comptrollerCallsContext;

  // Fetch user vToken balances
  if (accountAddress) {
    const poolLensCallContext: ContractCallContext = {
      reference: 'poolLens',
      contractAddress: poolLensContract.address,
      abi: poolLensAbi,
      calls: [
        {
          reference: 'vTokenBalancesAll',
          methodName: 'vTokenBalancesAll',
          methodParameters: [vTokenAddresses, accountAddress],
        },
      ],
    };

    multicallContexts.unshift(poolLensCallContext);
  }

  const multicallPromise = multicall.call(multicallContexts);
  let multicallOutput: ContractCallResults | undefined;
  let userWalletTokenBalances: GetTokenBalancesOutput | undefined;
  let poolLensResult: ContractCallReturnContext | undefined;
  let comptrollerCallUnformattedResults:
    | {
        [key: string]: ContractCallReturnContext;
      }
    | undefined;

  if (accountAddress) {
    [multicallOutput, userWalletTokenBalances] = await Promise.all([
      multicallPromise,
      // Fetch wallet token balances
      getTokenBalances({
        multicall,
        accountAddress,
        tokens: underlyingTokens,
        provider,
      }),
    ]);

    const { poolLens, ...remainingResults } = multicallOutput.results;

    poolLensResult = poolLens;
    comptrollerCallUnformattedResults = remainingResults;
  } else {
    multicallOutput = await multicallPromise;
    comptrollerCallUnformattedResults = multicallOutput.results;
  }

  // Fetch reward distributors
  const comptrollerResults = Object.values(comptrollerCallUnformattedResults);

  const rewardsDistributorsCallsContexts = comptrollerResults.reduce<ContractCallContext[]>(
    (acc, res) => {
      const pool = poolsResults.find(
        item =>
          item.comptroller.toLowerCase() ===
          res.originalContractCallContext.contractAddress.toLowerCase(),
      );

      if (!pool) {
        return acc;
      }

      const poolVTokenAddresses = pool.vTokens.map(item => item.vToken);
      const rewardsDistributorAddresses = res.callsReturnContext[0].returnValues;

      const speedCalls = poolVTokenAddresses.reduce<ContractCallContext['calls']>(
        (acc2, vTokenAddress) =>
          acc2.concat([
            {
              reference: 'rewardTokenSupplySpeed',
              methodName: 'rewardTokenSupplySpeeds',
              methodParameters: [vTokenAddress],
            },
            {
              reference: 'rewardTokenBorrowSpeed',
              methodName: 'rewardTokenBorrowSpeeds',
              methodParameters: [vTokenAddress],
            },
          ]),
        [],
      );

      const calls: ContractCallContext[] = rewardsDistributorAddresses.map(
        rewardsDistributorAddress => ({
          reference: rewardsDistributorAddress,
          contractAddress: rewardsDistributorAddress,
          abi: rewardsDistributorAbi,
          calls: [
            {
              reference: 'rewardToken',
              methodName: 'rewardToken',
              methodParameters: [],
            },
            ...speedCalls,
          ],
        }),
      );

      return acc.concat(calls);
    },
    [],
  );

  const rewardsDistributorsOutput = await multicall.call(rewardsDistributorsCallsContexts);
  const rewardsDistributorsResults = Object.values(rewardsDistributorsOutput.results);

  // Get addresses of all the tokens referenced
  const underlyingTokenAddresses = vTokenAddresses
    .map(vTokenAddress => getVTokenByAddress(vTokenAddress)?.underlyingToken.address)
    .filter((vTokenAddress): vTokenAddress is string => !!vTokenAddress);

  const rewardTokenAddresses = rewardsDistributorsResults.map(
    rewardsDistributorsResult => rewardsDistributorsResult.callsReturnContext[0].returnValues[0],
  ) as string[];

  const tokenAddresses = [
    // Remove duplicates
    ...new Set(underlyingTokenAddresses.concat(rewardTokenAddresses)),
  ];

  // Fetch token prices
  const resilientOracleCallsContext: ContractCallContext = {
    reference: 'resilientOracle',
    contractAddress: RESILIENT_ORACLE_ADDRESS,
    abi: resilientOracleAbi,
    calls: tokenAddresses.map(tokenAddress => ({
      reference: 'getPrice',
      methodName: 'getPrice',
      methodParameters: [tokenAddress],
    })),
  };

  const resilientOracleOutput = await multicall.call(resilientOracleCallsContext);
  const resilientOracleResult = resilientOracleOutput.results.resilientOracle;

  const pools = formatOutput({
    poolsResults,
    poolParticipantsCountResult,
    comptrollerResults,
    rewardsDistributorsResults,
    resilientOracleResult,
    poolLensResult,
    userWalletTokenBalances,
  });

  return {
    pools,
  };
};

export default getIsolatedPools;
