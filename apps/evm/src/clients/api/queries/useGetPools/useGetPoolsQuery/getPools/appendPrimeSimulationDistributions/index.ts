import BigNumber from 'bignumber.js';
import { NULL_ADDRESS } from 'constants/address';
import { primeAveragesForNetwork } from 'constants/prime';
import { primeAbi, primeV2LensAbi } from 'libs/contracts';
import type { Asset, ChainId, PrimeVersion, Token } from 'types';
import { areAddressesEqual, convertAprBipsToApy, convertTokensToMantissa } from 'utilities';
import type { Address, PublicClient } from 'viem';

export interface ResolvePrimeSimulationDistributionsInput {
  publicClient: PublicClient;
  primeContractAddress: Address;
  primeVTokenAddresses: readonly Address[];
  primeVersion: PrimeVersion;
  assets: Asset[];
  xvs: Token;
  accountAddress?: Address;
  chainId: ChainId;
}

export const appendPrimeSimulationDistributions = async ({
  publicClient,
  primeContractAddress,
  primeVTokenAddresses,
  primeVersion,
  assets,
  xvs,
  accountAddress,
  chainId,
}: ResolvePrimeSimulationDistributionsInput) =>
  Promise.allSettled(
    primeVTokenAddresses.map(primeVTokenAddress => {
      const asset = assets.find(poolAsset =>
        areAddressesEqual(poolAsset.vToken.address, primeVTokenAddress),
      );

      if (!asset) {
        return undefined;
      }

      const promise = async () => {
        const { address } = asset.vToken;
        const averageBorrowBalanceTokens =
          primeAveragesForNetwork[chainId]?.borrow[address] ||
          asset.borrowBalanceTokens.dividedBy(asset.borrowerCount || 1);

        const averageBorrowBalanceMantissa = convertTokensToMantissa({
          value: averageBorrowBalanceTokens,
          token: asset.vToken.underlyingToken,
        });

        const averageSupplyBalanceTokens =
          primeAveragesForNetwork[chainId]?.supply[address] ||
          asset.supplyBalanceTokens.dividedBy(asset.supplierCount || 1);
        const averageSupplyBalanceMantissa = convertTokensToMantissa({
          value: averageSupplyBalanceTokens,
          token: asset.vToken.underlyingToken,
        });

        const averageXvsStakedTokens =
          primeAveragesForNetwork[chainId]?.xvs[address] || new BigNumber(1);
        const averageXvsStakedMantissa = convertTokensToMantissa({
          value: averageXvsStakedTokens,
          token: xvs,
        });

        const simulatedPrimeAprs = await publicClient.readContract({
          abi: primeVersion === 1 ? primeAbi : primeV2LensAbi,
          address: primeContractAddress,
          functionName: 'estimateAPR',
          args: [
            primeVTokenAddress,
            accountAddress || NULL_ADDRESS,
            BigInt(averageBorrowBalanceMantissa.toFixed()),
            BigInt(averageSupplyBalanceMantissa.toFixed()),
            BigInt(averageXvsStakedMantissa.toFixed()),
          ],
        });

        const referenceValues = {
          userSupplyBalanceTokens: averageSupplyBalanceTokens,
          userBorrowBalanceTokens: averageBorrowBalanceTokens,
          userXvsStakedTokens: averageXvsStakedTokens,
        };

        if (simulatedPrimeAprs.borrowAPR > 0n) {
          const borrowSimulatedPrimeApy = convertAprBipsToApy({
            aprBips: simulatedPrimeAprs.borrowAPR.toString(),
          });

          asset.borrowTokenDistributions.push({
            type: 'primeSimulation',
            token: asset.vToken.underlyingToken,
            apyPercentage: borrowSimulatedPrimeApy,
            isActive: true,
            referenceValues,
          });
        }

        if (simulatedPrimeAprs.supplyAPR > 0n) {
          const supplySimulatedPrimeApy = convertAprBipsToApy({
            aprBips: simulatedPrimeAprs.supplyAPR.toString(),
          });

          asset.supplyTokenDistributions.push({
            type: 'primeSimulation',
            token: asset.vToken.underlyingToken,
            apyPercentage: supplySimulatedPrimeApy,
            isActive: true,
            referenceValues,
          });
        }
      };

      return promise();
    }),
  );
