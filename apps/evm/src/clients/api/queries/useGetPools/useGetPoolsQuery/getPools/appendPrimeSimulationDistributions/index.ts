import BigNumber from 'bignumber.js';
import type { Address, PublicClient } from 'viem';

import { NULL_ADDRESS } from 'constants/address';
import { AVERAGE_USER_XVS_VAULT_STAKE_TOKENS } from 'constants/prime';
import { primeAbi, primeV2LensAbi } from 'libs/contracts';
import type { Asset, PrimeVersion, Token } from 'types';
import {
  areAddressesEqual,
  convertAprBipsToApy,
  convertMantissaToTokens,
  convertTokensToMantissa,
} from 'utilities';

export interface ResolvePrimeSimulationDistributionsInput {
  publicClient: PublicClient;
  primeContractAddress: Address;
  primeVTokenAddresses: readonly Address[];
  primeVersion: PrimeVersion;
  assets: Asset[];
  xvs: Token;
  accountAddress?: Address;
}

export const appendPrimeSimulationDistributions = async ({
  publicClient,
  primeContractAddress,
  primeVTokenAddresses,
  primeVersion,
  assets,
  xvs,
  accountAddress,
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
        const averageBorrowBalanceTokens = asset.borrowBalanceTokens.dividedBy(
          asset.borrowerCount || 1,
        );

        const averageBorrowBalanceMantissa = convertTokensToMantissa({
          value: averageBorrowBalanceTokens,
          token: asset.vToken.underlyingToken,
        });

        const averageSupplyBalanceTokens = asset.supplyBalanceTokens.dividedBy(
          asset.supplierCount || 1,
        );
        const averageSupplyBalanceMantissa = convertTokensToMantissa({
          value: averageSupplyBalanceTokens,
          token: asset.vToken.underlyingToken,
        });

        const averageXvsStakedMantissa = convertTokensToMantissa({
          value: new BigNumber(AVERAGE_USER_XVS_VAULT_STAKE_TOKENS),
          token: xvs,
        });

        const estimateApr = ({
          borrowMantissa,
          supplyMantissa,
        }: {
          borrowMantissa: bigint;
          supplyMantissa: bigint;
        }) =>
          publicClient.readContract({
            abi: primeVersion === 1 ? primeAbi : primeV2LensAbi,
            address: primeContractAddress,
            functionName: 'estimateAPR',
            args: [
              primeVTokenAddress,
              accountAddress || NULL_ADDRESS,
              borrowMantissa,
              supplyMantissa,
              BigInt(averageXvsStakedMantissa.toFixed()),
            ],
          });

        const averageBorrowMantissa = BigInt(averageBorrowBalanceMantissa.toFixed());
        const averageSupplyMantissa = BigInt(averageSupplyBalanceMantissa.toFixed());

        const averageSimulatedPrimeAprs = await estimateApr({
          borrowMantissa: averageBorrowMantissa,
          supplyMantissa: averageSupplyMantissa,
        });

        const isBorrowCapped = averageSimulatedPrimeAprs.cappedBorrow < averageBorrowMantissa;
        const isSupplyCapped = averageSimulatedPrimeAprs.cappedSupply < averageSupplyMantissa;

        const referenceBorrowMantissa = isBorrowCapped
          ? averageSimulatedPrimeAprs.cappedBorrow
          : averageBorrowMantissa;
        const referenceSupplyMantissa = isSupplyCapped
          ? averageSimulatedPrimeAprs.cappedSupply
          : averageSupplyMantissa;

        const simulatedPrimeAprs =
          isBorrowCapped || isSupplyCapped
            ? await estimateApr({
                borrowMantissa: referenceBorrowMantissa,
                supplyMantissa: referenceSupplyMantissa,
              })
            : averageSimulatedPrimeAprs;

        const referenceValues = {
          userSupplyBalanceTokens: isSupplyCapped
            ? convertMantissaToTokens({
                value: referenceSupplyMantissa,
                token: asset.vToken.underlyingToken,
              })
            : averageSupplyBalanceTokens,
          userBorrowBalanceTokens: isBorrowCapped
            ? convertMantissaToTokens({
                value: referenceBorrowMantissa,
                token: asset.vToken.underlyingToken,
              })
            : averageBorrowBalanceTokens,
          userXvsStakedTokens: new BigNumber(AVERAGE_USER_XVS_VAULT_STAKE_TOKENS),
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
            referenceValues: {
              ...referenceValues,
              referenceType: isBorrowCapped ? 'cap' : 'average',
            },
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
            referenceValues: {
              ...referenceValues,
              referenceType: isSupplyCapped ? 'cap' : 'average',
            },
          });
        }
      };

      return promise();
    }),
  );
