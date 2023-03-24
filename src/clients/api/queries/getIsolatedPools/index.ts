import { abi as comptrollerAbi } from '@venusprotocol/isolated-pools/artifacts/contracts/Comptroller.sol/Comptroller.json';
import { abi as poolLensAbi } from '@venusprotocol/isolated-pools/artifacts/contracts/Lens/PoolLens.sol/PoolLens.json';
import { abi as rewardsDistributorAbi } from '@venusprotocol/isolated-pools/artifacts/contracts/Rewards/RewardsDistributor.sol/RewardsDistributor.json';
import { ContractCallContext, ContractCallResults } from 'ethereum-multicall';
import _cloneDeep from 'lodash/cloneDeep';
import { Token } from 'types';
import { areTokensEqual, getContractAddress, getTokenByAddress } from 'utilities';

import { getIsolatedPoolParticipantsCount } from 'clients/subgraph';

import getTokenBalances, { GetTokenBalancesOutput } from '../getTokenBalances';
import formatOutput from './formatOutput';
import { GetIsolatedPoolsInput, GetIsolatedPoolsOutput } from './types';

export type { GetIsolatedPoolsInput, GetIsolatedPoolsOutput } from './types';

const POOL_REGISTRY_ADDRESS = getContractAddress('poolRegistry');

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
          // TODO: send error event to Sentry indicating we're missing a token
          // record on the frontend (see VEN-1066)
          console.error(`Record missing for underlying token: ${vToken.underlyingAssetAddress}`);
        } else if (!newUnderlyingTokens.some(token => areTokensEqual(token, underlyingToken))) {
          newUnderlyingTokens.push(underlyingToken);
        }
      });

      return [acc[0].concat(newVTokenAddresses), acc[1].concat(newUnderlyingTokens)];
    },
    [[], []],
  );

  // Fetch additional vToken data
  const poolLensCalls: ContractCallContext['calls'] = [
    {
      reference: 'vTokenUnderlyingPriceAll',
      methodName: 'vTokenUnderlyingPriceAll(address[])',
      methodParameters: [vTokenAddresses],
    },
  ];

  if (accountAddress) {
    poolLensCalls.push({
      reference: 'vTokenBalancesAll',
      methodName: 'vTokenBalancesAll',
      methodParameters: [vTokenAddresses, accountAddress],
    });
  }

  const poolLensCallContext: ContractCallContext = {
    reference: 'poolLens',
    contractAddress: poolLensContract.address,
    abi: poolLensAbi,
    calls: poolLensCalls,
  };

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

  const multicallPromise = multicall.call([poolLensCallContext, ...comptrollerCallsContext]);
  let multicallOutput: ContractCallResults | undefined;
  let userWalletTokenBalances: GetTokenBalancesOutput | undefined;

  if (accountAddress) {
    [multicallOutput, userWalletTokenBalances] = await Promise.all([
      multicallPromise,
      getTokenBalances({
        multicall,
        accountAddress,
        tokens: underlyingTokens,
        provider,
      }),
    ]);
  } else {
    multicallOutput = await multicallPromise;
  }

  const { poolLens: poolLensResult, ...comptrollerCallUnformattedResults } =
    multicallOutput.results;

  // Fetch reward distributors
  const comptrollerResults = Object.values(comptrollerCallUnformattedResults);

  const rewardsDistributorsCallsContext = comptrollerResults.reduce<ContractCallContext[]>(
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

  const rewardsDistributorsOutput = await multicall.call(rewardsDistributorsCallsContext);
  const rewardsDistributorsResults = Object.values(rewardsDistributorsOutput.results);

  const pools = formatOutput({
    poolsResults,
    poolParticipantsCountResult,
    comptrollerResults,
    rewardsDistributorsResults,
    poolLensResult,
    userWalletTokenBalances,
    accountAddress,
  });

  return {
    pools,
  };
};

export default getIsolatedPools;
