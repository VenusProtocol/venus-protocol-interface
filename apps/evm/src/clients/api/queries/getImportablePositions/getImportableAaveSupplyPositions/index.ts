import BigNumber from 'bignumber.js';
import { SECONDS_PER_YEAR } from 'constants/time';
import { aaveUiPoolDataProviderAbi } from 'libs/contracts';
import { VError } from 'libs/errors';
import type { ImportableAaveSupplyPosition } from 'types';
import type { Address, PublicClient } from 'viem';

// Liquidity rates coming from Aave contracts use 27 decimals
const RAY = 10n ** 27n;

export interface GetImportableAaveSupplyPositionsInput {
  accountAddress: Address;
  publicClient: PublicClient;
  aaveUiPoolDataProviderContractAddress: Address;
  aavePoolAddressesProviderContractAddress: Address;
}

export interface GetImportableAaveSupplyPositionsOutput {
  importableSupplyPositions: ImportableAaveSupplyPosition[];
}

export const getImportableAaveSupplyPositions = async ({
  publicClient,
  accountAddress,
  aaveUiPoolDataProviderContractAddress,
  aavePoolAddressesProviderContractAddress,
}: GetImportableAaveSupplyPositionsInput): Promise<GetImportableAaveSupplyPositionsOutput> => {
  const [userReservesData, reservesData] = await publicClient.multicall({
    contracts: [
      {
        abi: aaveUiPoolDataProviderAbi,
        address: aaveUiPoolDataProviderContractAddress,
        functionName: 'getUserReservesData',
        args: [aavePoolAddressesProviderContractAddress, accountAddress],
      },
      {
        abi: aaveUiPoolDataProviderAbi,
        address: aaveUiPoolDataProviderContractAddress,
        functionName: 'getReservesData',
        args: [aavePoolAddressesProviderContractAddress],
      },
    ],
  });

  if (userReservesData.status === 'failure' || reservesData.status === 'failure') {
    throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
  }

  // Map user aToken balances by underlying token address
  const userATokenBalanceMapping: {
    [tokenAddress: Address]: {
      supplyBalanceMantissa: bigint;
    };
  } = {};

  let userHasBorrowPosition = false;

  userReservesData.result.forEach(data => {
    if (typeof data === 'number') {
      return;
    }

    data.forEach(({ underlyingAsset, scaledATokenBalance, scaledVariableDebt }) => {
      if (scaledVariableDebt > 0n) {
        userHasBorrowPosition = true;
        return;
      }

      userATokenBalanceMapping[underlyingAsset.toLowerCase() as Address] = {
        supplyBalanceMantissa: scaledATokenBalance,
      };
    });
  });

  // Return no importable positions if user has any borrow position
  if (userHasBorrowPosition) {
    return {
      importableSupplyPositions: [],
    };
  }

  const importableSupplyPositions: ImportableAaveSupplyPosition[] = [];

  // Map reserves by underlying token address
  reservesData.result.forEach(data => {
    if ('marketReferenceCurrencyPriceInUsd' in data) {
      return;
    }

    data.forEach(
      ({ liquidityRate, liquidityIndex, underlyingAsset, aTokenAddress, availableLiquidity }) => {
        const tokenAddress = underlyingAsset.toLowerCase() as Address;

        // Skip assets for which user has no supply position
        if (!Object.prototype.hasOwnProperty.call(userATokenBalanceMapping, tokenAddress)) {
          return;
        }

        const userABalances = userATokenBalanceMapping[tokenAddress];

        if (userABalances.supplyBalanceMantissa === 0n) {
          return;
        }

        const userSupplyBalanceMantissa = BigInt(
          new BigNumber(Number(userABalances.supplyBalanceMantissa))
            .multipliedBy(Number(liquidityIndex))
            .dividedBy(Number(RAY))
            .toFixed(0, BigNumber.ROUND_DOWN),
        );

        // Skip positions for which pool doesn't have enough liquidity available to withdraw
        if (availableLiquidity < userSupplyBalanceMantissa) {
          return;
        }

        // Convert rate to APY
        const ratePerSecond = Number(liquidityRate) / Number(RAY);
        const supplyApyPercentage =
          ((1 + ratePerSecond / SECONDS_PER_YEAR) ** SECONDS_PER_YEAR - 1) * 100;

        const importableSupplyPosition: ImportableAaveSupplyPosition = {
          protocol: 'aave',
          userSupplyBalanceMantissa,
          supplyApyPercentage,
          aTokenAddress,
          userATokenBalanceMantissa: userABalances.supplyBalanceMantissa,
          // Because aTokens have an exchange rate of 1 with tokens, then the token balance
          // corresponds to the aToken supply balance when including interests
          userATokenBalanceWithInterestsMantissa: userSupplyBalanceMantissa,
          tokenAddress,
        };

        importableSupplyPositions.push(importableSupplyPosition);
      },
    );
  });

  return {
    importableSupplyPositions,
  };
};
