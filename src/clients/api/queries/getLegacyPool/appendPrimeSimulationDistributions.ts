import BigNumber from 'bignumber.js';
import { Prime } from 'packages/contracts';
import { Asset, Token } from 'types';
import {
  areAddressesEqual,
  convertAprToApy,
  convertTokensToMantissa,
} from 'utilities';

import { NULL_ADDRESS } from 'constants/address';

export interface ResolvePrimeSimulationDistributionsInput {
  primeContract: Prime;
  primeVTokenAddresses: string[];
  assets: Asset[];
  xvs: Token;
  accountAddress?: string;
}

export const appendPrimeSimulationDistributions = async ({
  primeContract,
  primeVTokenAddresses,
  assets,
  xvs,
  accountAddress,
}: ResolvePrimeSimulationDistributionsInput) => Promise.allSettled(
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

        // Estimate Prime APR with an amount of 10k XVS staked
        const stakedXvsForEstimationTokens = new BigNumber(10000);
        const stakedXvsForEstimationMantissa = convertTokensToMantissa({
          value: stakedXvsForEstimationTokens,
          token: xvs,
        });

        const simulatedPrimeAprs = await primeContract.estimateAPR(
          primeVTokenAddress,
          accountAddress || NULL_ADDRESS,
          averageBorrowBalanceMantissa.toFixed(),
          averageSupplyBalanceMantissa.toFixed(),
          stakedXvsForEstimationMantissa.toFixed(),
        );

        const referenceValues = {
          userSupplyBalanceTokens: averageSupplyBalanceTokens,
          userBorrowBalanceTokens: averageBorrowBalanceTokens,
          userXvsStakedTokens: stakedXvsForEstimationTokens,
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
