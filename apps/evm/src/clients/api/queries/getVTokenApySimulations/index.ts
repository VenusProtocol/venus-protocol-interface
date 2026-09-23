import BigNumber from 'bignumber.js';

import { COMPOUND_MANTISSA } from 'constants/compoundMantissa';
import { jumpRateModelAbi, jumpRateModelV2Abi } from 'libs/contracts';
import { convertTokensToMantissa } from 'utilities';
import formatCurrentUtilizationRate from './formatCurrentUtilizationRate';
import formatToApySnapshots from './formatToApySnapshots';
import type { GetVTokenApySimulationsInput, GetVTokenApySimulationsOutput } from './types';

const REFERENCE_AMOUNT_MANTISSA = 10000;
const REFERENCE_BAD_DEBT_MANTISSA = 0n;

export const getVTokenApySimulations = async ({
  publicClient,
  interestRateModelContractAddress,
  isIsolatedPoolMarket,
  asset,
  blocksPerDay,
}: GetVTokenApySimulationsInput): Promise<GetVTokenApySimulationsOutput> => {
  const reserveFactorMantissa = new BigNumber(asset.reserveFactor).multipliedBy(COMPOUND_MANTISSA);
  const abi = isIsolatedPoolMarket ? jumpRateModelV2Abi : jumpRateModelAbi;

  const borrowRateCalls = [];
  const supplyRateCalls = [];

  for (let u = 1; u <= 100; u++) {
    const utilizationRatePercentage = u / 100;
    const cashAmountMantissa = new BigNumber(1 / utilizationRatePercentage - 1)
      .times(REFERENCE_AMOUNT_MANTISSA)
      .dp(0)
      .toFixed();

    const borrowsAmountMantissa = new BigNumber(REFERENCE_AMOUNT_MANTISSA).toFixed();
    const reservesAmountMantissa = new BigNumber(0).toFixed();

    if (isIsolatedPoolMarket) {
      borrowRateCalls.push({
        address: interestRateModelContractAddress,
        abi,
        functionName: 'getBorrowRate',
        args: [
          cashAmountMantissa,
          borrowsAmountMantissa,
          reservesAmountMantissa,
          REFERENCE_BAD_DEBT_MANTISSA,
        ],
      });

      supplyRateCalls.push({
        address: interestRateModelContractAddress,
        abi,
        functionName: 'getSupplyRate',
        args: [
          cashAmountMantissa,
          borrowsAmountMantissa,
          reservesAmountMantissa,
          reserveFactorMantissa.toFixed(),
          REFERENCE_BAD_DEBT_MANTISSA,
        ],
      });
    } else {
      borrowRateCalls.push({
        address: interestRateModelContractAddress,
        abi,
        functionName: 'getBorrowRate',
        args: [cashAmountMantissa, borrowsAmountMantissa, reservesAmountMantissa],
      });

      supplyRateCalls.push({
        address: interestRateModelContractAddress,
        abi,
        functionName: 'getSupplyRate',
        args: [
          cashAmountMantissa,
          borrowsAmountMantissa,
          reservesAmountMantissa,
          reserveFactorMantissa.toFixed(),
        ],
      });
    }
  }

  const cashMantissa = BigInt(
    convertTokensToMantissa({
      value: asset.cashTokens,
      token: asset.vToken.underlyingToken,
    }).toFixed(),
  );
  const borrowBalanceMantissa = BigInt(
    convertTokensToMantissa({
      value: asset.borrowBalanceTokens,
      token: asset.vToken.underlyingToken,
    }).toFixed(),
  );
  const reservesMantissa = BigInt(
    convertTokensToMantissa({
      value: asset.reserveTokens,
      token: asset.vToken.underlyingToken,
    }).toFixed(),
  );

  const [borrowRatePercentages, supplyRatePercentages, utilizationRatePercentage] =
    await Promise.all([
      publicClient.multicall({
        contracts: borrowRateCalls,
      }),
      publicClient.multicall({
        contracts: supplyRateCalls,
      }),
      publicClient.readContract({
        address: interestRateModelContractAddress,
        abi,
        functionName: 'utilizationRate',
        args: isIsolatedPoolMarket
          ? [cashMantissa, borrowBalanceMantissa, reservesMantissa, asset.badDebtMantissa]
          : [cashMantissa, borrowBalanceMantissa, reservesMantissa],
      }),
    ]);

  const apySimulations = formatToApySnapshots({
    borrowRatePercentages: borrowRatePercentages.map(r => r.result as bigint),
    supplyRatePercentages: supplyRatePercentages.map(r => r.result as bigint),
    blocksPerDay,
  });

  const currentUtilizationRatePercentage = formatCurrentUtilizationRate({
    utilizationRatePercentage,
  });

  return {
    apySimulations,
    currentUtilizationRatePercentage,
  };
};
