import type BigNumber from 'bignumber.js';

import { NULL_ADDRESS } from 'constants/address';
import {
  borrowAveragesForToken,
  supplyAveragesForToken,
  xvsStakedAveragesForToken,
} from 'constants/prime';
import type { Prime } from 'libs/contracts';
import type { Asset, Token } from 'types';
import {
  areAddressesEqual,
  convertAprBipsToApy,
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
        const { symbol } = asset.vToken.underlyingToken;
        const averageBorrowBalanceTokens =
          borrowAveragesForToken[symbol] ||
          asset.borrowBalanceTokens.dividedBy(asset.borrowerCount || 1);

        const averageBorrowBalanceMantissa = convertTokensToMantissa({
          value: averageBorrowBalanceTokens,
          token: asset.vToken.underlyingToken,
        });

        const averageSupplyBalanceTokens =
          supplyAveragesForToken[symbol] ||
          asset.supplyBalanceTokens.dividedBy(asset.supplierCount || 1);
        const averageSupplyBalanceMantissa = convertTokensToMantissa({
          value: averageSupplyBalanceTokens,
          token: asset.vToken.underlyingToken,
        });

        const averageXvsStakedTokens =
          xvsStakedAveragesForToken[symbol] || primeMinimumXvsToStakeTokens;
        const averageXvsStakedMantissa = convertTokensToMantissa({
          value: averageXvsStakedTokens,
          token: xvs,
        });

        const simulatedPrimeAprs = await primeContract.estimateAPR(
          primeVTokenAddress,
          accountAddress || NULL_ADDRESS,
          averageBorrowBalanceMantissa.toFixed(),
          averageSupplyBalanceMantissa.toFixed(),
          averageXvsStakedMantissa.toFixed(),
        );

        const referenceValues = {
          userSupplyBalanceTokens: averageSupplyBalanceTokens,
          userBorrowBalanceTokens: averageBorrowBalanceTokens,
          userXvsStakedTokens: averageXvsStakedTokens,
        };

        if (!simulatedPrimeAprs.borrowAPR.isZero()) {
          const borrowSimulatedPrimeApy = convertAprBipsToApy({
            aprBips: simulatedPrimeAprs.borrowAPR.toString(),
          });

          asset.borrowDistributions.push({
            type: 'primeSimulation',
            token: asset.vToken.underlyingToken,
            apyPercentage: borrowSimulatedPrimeApy,
            referenceValues,
          });
        }

        if (!simulatedPrimeAprs.supplyAPR.isZero()) {
          const supplySimulatedPrimeApy = convertAprBipsToApy({
            aprBips: simulatedPrimeAprs.supplyAPR.toString(),
          });

          asset.supplyDistributions.push({
            type: 'primeSimulation',
            token: asset.vToken.underlyingToken,
            apyPercentage: supplySimulatedPrimeApy,
            referenceValues,
          });
        }
      };

      return promise();
    }),
  );
};
