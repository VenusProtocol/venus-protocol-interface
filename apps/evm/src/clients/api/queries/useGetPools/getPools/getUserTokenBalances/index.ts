import BigNumber from 'bignumber.js';
import { getTokenBalances } from 'clients/api';
import { NATIVE_TOKEN_ADDRESS } from 'constants/address';
import { poolLensAbi, venusLensAbi } from 'libs/contracts';
import type { ChainId, Token } from 'types';
import { areAddressesEqual, findTokenByAddress, isPoolIsolated } from 'utilities';
import type { Address, PublicClient } from 'viem';
import type { VTokenBalance } from '../../types';
import type { ApiPool } from '../getApiPools';

export const getUserTokenBalances = async ({
  accountAddress,
  apiPools,
  chainId,
  tokens,
  publicClient,
  poolLensContractAddress,
  venusLensContractAddress,
}: {
  accountAddress: Address;
  apiPools: ApiPool[];
  chainId: ChainId;
  tokens: Token[];
  publicClient: PublicClient;
  poolLensContractAddress: Address;
  venusLensContractAddress?: Address;
}) => {
  // Extract token records and addresses
  const [legacyPoolVTokenAddresses, isolatedPoolsVTokenAddresses, underlyingTokens] =
    apiPools.reduce<[Address[], Address[], Token[]]>(
      (acc, pool) => {
        const newLegacyPoolVTokenAddresses: Address[] = [];
        const newIsolatedPoolsVTokenAddresses: Address[] = [];
        const newUnderlyingTokens: Token[] = [];
        const newUnderlyingTokenAddresses: Address[] = [];

        pool.markets.forEach(market => {
          const isIsolated = isPoolIsolated({
            chainId,
            comptrollerAddress: pool.address,
          });

          // VToken addresses are unique
          if (isIsolated) {
            newIsolatedPoolsVTokenAddresses.push(market.address.toLowerCase() as Address);
          } else {
            newLegacyPoolVTokenAddresses.push(market.address.toLowerCase() as Address);
          }

          const underlyingToken = findTokenByAddress({
            address: market.underlyingAddress || NATIVE_TOKEN_ADDRESS,
            tokens,
          });

          if (
            underlyingToken &&
            !newUnderlyingTokenAddresses.includes(underlyingToken.address.toLowerCase() as Address)
          ) {
            newUnderlyingTokens.push(underlyingToken);
            newUnderlyingTokenAddresses.push(underlyingToken.address.toLowerCase() as Address);
          }
        });

        return [
          acc[0].concat(newLegacyPoolVTokenAddresses),
          acc[1].concat(newIsolatedPoolsVTokenAddresses),
          acc[2].concat(newUnderlyingTokens),
        ];
      },
      [[], [], []],
    );

  const [userTokenBalances, userIsolatedPoolVTokenBalances, userLegacyPoolVTokenBalances] =
    await Promise.all([
      getTokenBalances({
        accountAddress,
        tokens: underlyingTokens,
        publicClient,
      }),
      publicClient.simulateContract({
        abi: poolLensAbi,
        address: poolLensContractAddress,
        functionName: 'vTokenBalancesAll',
        args: [isolatedPoolsVTokenAddresses, accountAddress],
      }),
      venusLensContractAddress
        ? publicClient.simulateContract({
            abi: venusLensAbi,
            address: venusLensContractAddress,
            functionName: 'vTokenBalancesAll',
            // TODO: Temporary fix for VSolvBTC, remove when changes are done in their side
            args: [
              legacyPoolVTokenAddresses.filter(
                a => !areAddressesEqual(a, '0xf841cb62c19fcd4ff5cd0aab5939f3140baac3ea'),
              ),
              accountAddress,
            ],
          })
        : undefined,
    ]);

  const userVTokenBalances = [
    ...userIsolatedPoolVTokenBalances.result,
    ...(userLegacyPoolVTokenBalances?.result || []),
  ].map(res => {
    const vTokenBalance: VTokenBalance = {
      vTokenAddress: res.vToken,
      underlyingTokenBorrowBalanceMantissa: new BigNumber(res.borrowBalanceCurrent.toString()),
      underlyingTokenSupplyBalanceMantissa: new BigNumber(res.balanceOfUnderlying.toString()),
    };

    return vTokenBalance;
  });

  return {
    userTokenBalances: userTokenBalances?.tokenBalances,
    userVTokenBalances,
  };
};
