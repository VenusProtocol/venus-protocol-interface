import BigNumber from 'bignumber.js';

import { NULL_ADDRESS } from 'constants/address';
import { Prime } from 'packages/contracts';
import { Asset, Token } from 'types';
import {
  areAddressesEqual,
  convertAprToApy,
  convertMantissaToTokens,
  convertTokensToMantissa,
} from 'utilities';

export interface ResolvePrimeSimulationDistributionsInput {
  primeContract: Prime;
  primeVTokenAddresses: string[];
  assets: Asset[];
  xvs: Token;
  primeMinimumXvsToStakeMantissa: BigNumber;
  accountAddress?: string;
}

export const appendPrimeSimulationDistributions = async ({
  primeContract,
  primeVTokenAddresses,
  assets,
  xvs,
  accountAddress,
  primeMinimumXvsToStakeMantissa,
}: ResolvePrimeSimulationDistributionsInput) => {
  const primeMinimumXvsToStakeTokens = convertMantissaToTokens({
    value: primeMinimumXvsToStakeMantissa,
    token: xvs,
  });

  return Promise.allSettled(
    primeVTokenAddresses.map(primeVTokenAddress => {
      const asset = assets.find(poolAsset =>
        areAddressesEqual(poolAsset.vToken.address, primeVTokenAddress),
      );

      if (!asset) {
        return undefined;
      }

      const promise = async () => {
        const averageBorrowBalanceTokens = asset.borrowBalanceTokens.dividedBy(asset.borrowerCount);
        const averageBorrowBalanceMantissa = convertTokensToMantissa({
          value: averageBorrowBalanceTokens,
          token: asset.vToken.underlyingToken,
        });

        const averageSupplyBalanceTokens = asset.supplyBalanceTokens.dividedBy(asset.supplierCount);
        const averageSupplyBalanceMantissa = convertTokensToMantissa({
          value: averageSupplyBalanceTokens,
          token: asset.vToken.underlyingToken,
        });

        const simulatedPrimeAprs = await primeContract.estimateAPR(
          primeVTokenAddress,
          accountAddress || NULL_ADDRESS,
          averageBorrowBalanceMantissa.toFixed(),
          averageSupplyBalanceMantissa.toFixed(),
          primeMinimumXvsToStakeMantissa.toFixed(),
        );

        const referenceValues = {
          userSupplyBalanceTokens: averageSupplyBalanceTokens,
          userBorrowBalanceTokens: averageBorrowBalanceTokens,
          userXvsStakedTokens: primeMinimumXvsToStakeTokens,
        };

        const borrowSimulatedPrimeApy = convertAprToApy({
          aprBips: simulatedPrimeAprs.borrowAPR.toString(),
        });

        asset.borrowDistributions.push({
          type: 'primeSimulation',
          token: asset.vToken.underlyingToken,
          apyPercentage: borrowSimulatedPrimeApy,
          referenceValues,
        });

        const supplySimulatedPrimeApy = convertAprToApy({
          aprBips: simulatedPrimeAprs.supplyAPR.toString(),
        });

        asset.supplyDistributions.push({
          type: 'primeSimulation',
          token: asset.vToken.underlyingToken,
          apyPercentage: supplySimulatedPrimeApy,
          referenceValues,
        });
      };

      return promise();
    }),
  );
};
