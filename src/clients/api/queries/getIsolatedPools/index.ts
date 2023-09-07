import {
  ContractCallContext,
  ContractCallResults,
  ContractCallReturnContext,
} from 'ethereum-multicall';
import _cloneDeep from 'lodash/cloneDeep';
import { contractInfos } from 'packages/contracts';
import { Token } from 'types';
import { areTokensEqual, getTokenByAddress } from 'utilities';

import { getIsolatedPoolParticipantsCount } from 'clients/subgraph';
import { logError } from 'context/ErrorLogger';

import getBlockNumber from '../getBlockNumber';
import getTokenBalances, { GetTokenBalancesOutput } from '../getTokenBalances';
import formatOutput from './formatOutput';
import { GetIsolatedPoolsInput, GetIsolatedPoolsOutput } from './types';

export type { GetIsolatedPoolsInput, GetIsolatedPoolsOutput } from './types';

// Since the borrower and supplier counts aren't essential information, we make the logic so the
// dApp can still function if the subgraph is down
const safelyGetIsolatedPoolParticipantsCount = async () => {
  try {
    const res = await getIsolatedPoolParticipantsCount();
    return res;
  } catch (error) {
    logError(error);
  }
};

const getIsolatedPools = async ({
  accountAddress,
  poolLensContract,
  poolRegistryContractAddress,
  resilientOracleContractAddress,
  provider,
  multicall3,
}: GetIsolatedPoolsInput): Promise<GetIsolatedPoolsOutput> => {
  const [poolsResults, poolParticipantsCountResult, currentBlockNumberResult] = await Promise.all([
    // Fetch all pools
    poolLensContract.getAllPools(poolRegistryContractAddress),
    // Fetch borrower and supplier counts of each isolated token
    safelyGetIsolatedPoolParticipantsCount(),
    // Fetch current block number
    getBlockNumber({ provider }),
  ]);

  // Extract token records and addresses
  const [vTokenAddresses, underlyingTokens, underlyingTokenAddresses] = poolsResults.reduce<
    [string[], Token[], string[]]
  >(
    (acc, poolResult) => {
      const newVTokenAddresses: string[] = [];
      const newUnderlyingTokens: Token[] = [];
      const newUnderlyingTokenAddresses: string[] = [];

      poolResult.vTokens.forEach(vTokenMetaData => {
        const underlyingToken = getTokenByAddress(vTokenMetaData.underlyingAssetAddress);

        if (!underlyingToken) {
          logError(`Record missing for underlying token: ${vTokenMetaData.underlyingAssetAddress}`);
          return;
        }

        if (!newVTokenAddresses.includes(vTokenMetaData.vToken)) {
          newVTokenAddresses.push(vTokenMetaData.vToken);
        }

        if (
          !newUnderlyingTokens.some(listedUnderlyingToken =>
            areTokensEqual(listedUnderlyingToken, underlyingToken),
          )
        ) {
          newUnderlyingTokens.push(underlyingToken);
        }

        if (!newUnderlyingTokenAddresses.includes(underlyingToken.address)) {
          newUnderlyingTokenAddresses.push(underlyingToken.address);
        }
      });

      return [
        acc[0].concat(newVTokenAddresses),
        acc[1].concat(newUnderlyingTokens),
        acc[2].concat(newUnderlyingTokenAddresses),
      ];
    },
    [[], [], []],
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
      abi: contractInfos.isolatedPoolComptroller.abi,
      calls,
    };
  });

  const multicallContexts: ContractCallContext[] = comptrollerCallsContext;

  // Fetch user vToken balances
  if (accountAddress) {
    const poolLensCallContext: ContractCallContext = {
      reference: 'poolLens',
      contractAddress: poolLensContract.address,
      abi: contractInfos.poolLens.abi,
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

  const multicallPromise = multicall3.call(multicallContexts);
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
        multicall3,
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

      const rewardsDistributorCalls = poolVTokenAddresses.reduce<ContractCallContext['calls']>(
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
            {
              reference: 'rewardTokenSupplyState',
              methodName: 'rewardTokenSupplyState',
              methodParameters: [vTokenAddress],
            },
            {
              reference: 'rewardTokenBorrowState',
              methodName: 'rewardTokenBorrowState',
              methodParameters: [vTokenAddress],
            },
          ]),
        [],
      );

      const calls: ContractCallContext[] = rewardsDistributorAddresses.map(
        rewardsDistributorAddress => ({
          reference: rewardsDistributorAddress,
          contractAddress: rewardsDistributorAddress,
          abi: contractInfos.rewardsDistributor.abi,
          calls: [
            {
              reference: 'rewardToken',
              methodName: 'rewardToken',
              methodParameters: [],
            },
            ...rewardsDistributorCalls,
          ],
        }),
      );

      return acc.concat(calls);
    },
    [],
  );

  const rewardsDistributorsOutput = await multicall3.call(rewardsDistributorsCallsContexts);
  const rewardsDistributorsResults = Object.values(rewardsDistributorsOutput.results);

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
    contractAddress: resilientOracleContractAddress,
    abi: contractInfos.resilientOracle.abi,
    calls: tokenAddresses.map(tokenAddress => ({
      reference: 'getPrice',
      methodName: 'getPrice',
      methodParameters: [tokenAddress],
    })),
  };

  const resilientOracleOutput = await multicall3.call(resilientOracleCallsContext);
  const resilientOracleResult = resilientOracleOutput.results.resilientOracle;

  const pools = formatOutput({
    poolsResults,
    poolParticipantsCountResult,
    comptrollerResults,
    rewardsDistributorsResults,
    resilientOracleResult,
    poolLensResult,
    userWalletTokenBalances,
    currentBlockNumber: currentBlockNumberResult.blockNumber,
  });

  return {
    pools,
  };
};

export default getIsolatedPools;
