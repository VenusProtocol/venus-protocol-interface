import BigNumber from 'bignumber.js';
import { ContractCallContext, ContractCallResults } from 'ethereum-multicall';
import { VToken } from 'types';
import { getVTokenByAddress } from 'utilities';

import { getIsolatedPools as getSubgraphIsolatedPools } from 'clients/subgraph';
import { COMPOUND_MANTISSA } from 'constants/compoundMantissa';
import oracleAbi from 'constants/contracts/abis/oracle.json';

import getTokenBalances, { GetTokenBalancesOutput } from '../getTokenBalances';
import formatToPool from './formatToPool';
import { FormatToPoolInput, GetIsolatedPoolsInput, GetIsolatedPoolsOutput } from './types';

export type { GetIsolatedPoolsInput, GetIsolatedPoolsOutput } from './types';

const getIsolatedPools = async ({
  accountAddress,
  multicall,
  provider,
}: GetIsolatedPoolsInput): Promise<GetIsolatedPoolsOutput> => {
  // Fetch isolated pools from subgraph
  const subgraphIsolatedPools = await getSubgraphIsolatedPools({
    accountAddress,
  });

  // Extract all tokens by price oracle
  const vTokensByPriceOracle = (subgraphIsolatedPools.pools || []).reduce<{
    [priceOracleAddress: string]: VToken[];
  }>((accTokensByPool, pool) => {
    // Extract all vTokens of pool
    const poolTokens = pool.markets.reduce<VToken[]>((accPoolTokens, market) => {
      const vToken = getVTokenByAddress(market.id);
      return vToken ? [...accPoolTokens, vToken] : accPoolTokens;
    }, []);

    console.log(poolTokens);

    if (poolTokens.length === 0) {
      return accTokensByPool;
    }

    const priceOracleAddress = pool.priceOracleAddress.toLowerCase();
    const existingTokens = accTokensByPool[priceOracleAddress] || [];

    return {
      ...accTokensByPool,
      [priceOracleAddress]: existingTokens.concat(poolTokens),
    };
  }, {});

  const vTokens = Object.values(vTokensByPriceOracle).flat();

  // Add promise to fetch dollar prices
  const tokenPricesCallContext: ContractCallContext[] = Object.keys(vTokensByPriceOracle).map(
    priceOracleAddress => ({
      reference: priceOracleAddress,
      contractAddress: priceOracleAddress,
      abi: oracleAbi,
      calls: vTokensByPriceOracle[priceOracleAddress].map(vToken => ({
        reference: vToken.address,
        methodName: 'getUnderlyingPrice',
        methodParameters: [vToken.address],
      })),
    }),
  );

  const promises = [multicall.call(tokenPricesCallContext)] as
    | [Promise<ContractCallResults>]
    | [Promise<ContractCallResults>, Promise<GetTokenBalancesOutput>];

  if (accountAddress) {
    // Add promise to fetch user wallet balances
    promises[1] = getTokenBalances({
      accountAddress,
      multicall,
      provider,
      tokens: vTokens.map(vToken => vToken.underlyingToken),
    });
  }

  const [tokenPricesCallResults, userWalletBalancesResult] = await Promise.all(promises);

  // Index token prices by their address
  const tokenPricesDollars = Object.values(tokenPricesCallResults.results)
    .map(result => result.callsReturnContext)
    .flat()
    .reduce<FormatToPoolInput['tokenPricesDollars']>((accTokenPricesDollars, callReturnContext) => {
      if (!callReturnContext.returnValues[0]) {
        return accTokenPricesDollars;
      }

      const vTokenAddress = callReturnContext.methodParameters[0].toLowerCase();
      const vToken = getVTokenByAddress(vTokenAddress);

      if (!vToken) {
        return accTokenPricesDollars;
      }

      const priceDollars = new BigNumber(callReturnContext.returnValues[0].hex)
        .dividedBy(COMPOUND_MANTISSA)
        .dp(2);

      return {
        ...accTokenPricesDollars,
        [vToken.underlyingToken.address.toLowerCase()]: priceDollars,
      };
    }, {});

  // Index wallet token balances by their address
  let userWalletBalances: FormatToPoolInput['userWalletBalances'];

  if (userWalletBalancesResult) {
    userWalletBalances = userWalletBalancesResult.tokenBalances.reduce<typeof userWalletBalances>(
      (accTokenUserWalletBalances, userWalletBalance) => ({
        ...accTokenUserWalletBalances,
        [userWalletBalance.token.address.toLowerCase()]: userWalletBalance.balanceWei,
      }),
      {},
    );
  }

  const pools = (subgraphIsolatedPools.pools || []).map(subgraphPool =>
    formatToPool({
      subgraphPool,
      tokenPricesDollars,
      userWalletBalances,
    }),
  );

  return {
    pools,
  };
};

export default getIsolatedPools;
