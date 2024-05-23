import BigNumber from 'bignumber.js';
import { COMPOUND_MANTISSA } from 'constants/compoundMantissa';
import type { IsolatedPoolComptroller, LegacyPoolComptroller } from 'libs/contracts';
import { convertPercentageFromSmartContract } from 'utilities';

export interface GetPoolLiquidationIncentiveInput {
  poolComptrollerContract: LegacyPoolComptroller | IsolatedPoolComptroller;
}

export type GetPoolLiquidationIncentiveOutput = {
  liquidationIncentivePercentage: number;
};

export const getPoolLiquidationIncentive = async ({
  poolComptrollerContract,
}: GetPoolLiquidationIncentiveInput): Promise<GetPoolLiquidationIncentiveOutput> => {
  const res = await poolComptrollerContract.liquidationIncentiveMantissa();

  const liquidationIncentivePercentage = convertPercentageFromSmartContract(
    new BigNumber(res.toString()).minus(COMPOUND_MANTISSA),
  );

  return {
    liquidationIncentivePercentage,
  };
};
