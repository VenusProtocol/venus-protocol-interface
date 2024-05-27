import BigNumber from 'bignumber.js';
import type { IsolatedPoolComptroller } from 'libs/contracts';
import { convertPercentageFromSmartContract } from 'utilities';

export interface GetIsolatedPoolVTokenLiquidationThresholdInput {
  poolComptrollerContract: IsolatedPoolComptroller;
  vTokenAddress: string;
}

export type GetIsolatedPoolVTokenLiquidationThresholdOutput = {
  liquidationThresholdPercentage: number;
};

export const getIsolatedPoolVTokenLiquidationThreshold = async ({
  poolComptrollerContract,
  vTokenAddress,
}: GetIsolatedPoolVTokenLiquidationThresholdInput): Promise<GetIsolatedPoolVTokenLiquidationThresholdOutput> => {
  const res = await poolComptrollerContract.markets(vTokenAddress);

  const liquidationThresholdPercentage = convertPercentageFromSmartContract(
    new BigNumber(res.liquidationThresholdMantissa.toString()),
  );

  return {
    liquidationThresholdPercentage,
  };
};
