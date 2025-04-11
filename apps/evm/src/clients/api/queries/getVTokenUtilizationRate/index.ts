import { jumpRateModelAbi, jumpRateModelV2Abi } from 'libs/contracts';

import type { Asset } from 'types';
import { type Address, type PublicClient, parseUnits } from 'viem';

const BAD_DEBT_MANTISSA = '0';
const BIG_INT_DIVIDER = 10n ** 16n;

export interface GetVTokenUtilizationRateInput {
  publicClient: PublicClient;
  interestRateModelContractAddress: Address;
  isIsolatedPoolMarket: boolean;
  asset: Asset;
}

export type GetVTokenUtilizationRateOutput = {
  utilizationRatePercentage: number;
};

export const getVTokenUtilizationRate = async ({
  publicClient,
  interestRateModelContractAddress,
  isIsolatedPoolMarket,
  asset,
}: GetVTokenUtilizationRateInput): Promise<GetVTokenUtilizationRateOutput> => {
  const cashMantissa = parseUnits(
    asset.cashTokens.toFixed(),
    asset.vToken.underlyingToken.decimals,
  );

  const borrowBalanceMantissa = parseUnits(
    asset.borrowBalanceTokens.toFixed(),
    asset.vToken.underlyingToken.decimals,
  );

  const reservesMantissa = parseUnits(
    asset.reserveTokens.toFixed(),
    asset.vToken.underlyingToken.decimals,
  );

  const badDebtMantissa = parseUnits(BAD_DEBT_MANTISSA, asset.vToken.underlyingToken.decimals);

  const utilizationRateMantissa = await publicClient.readContract({
    address: interestRateModelContractAddress,
    abi: isIsolatedPoolMarket ? jumpRateModelV2Abi : jumpRateModelAbi,
    functionName: 'utilizationRate',
    args: isIsolatedPoolMarket
      ? [cashMantissa, borrowBalanceMantissa, reservesMantissa, badDebtMantissa]
      : [cashMantissa, borrowBalanceMantissa, reservesMantissa],
  });

  const utilizationRatePercentage = Number(utilizationRateMantissa / BIG_INT_DIVIDER);

  return { utilizationRatePercentage };
};
