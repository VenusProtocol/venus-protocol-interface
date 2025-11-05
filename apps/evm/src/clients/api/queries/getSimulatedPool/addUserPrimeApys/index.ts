import type BigNumber from 'bignumber.js';
import type { Address, PublicClient } from 'viem';

import { primeAbi } from 'libs/contracts';
import type { Asset, Token, TokenDistribution } from 'types';
import { convertAprBipsToApy, convertTokensToMantissa } from 'utilities';

const toMantissa = ({
  value,
  token,
}: {
  value: BigNumber;
  token: Token;
}) => BigInt(convertTokensToMantissa({ value, token }).toFixed());

const updatePrimeDistribution = ({
  distributions,
  primeApyPercentage,
}: {
  distributions: TokenDistribution[];
  primeApyPercentage: BigNumber;
}) =>
  distributions.map(d => (d.type === 'prime' ? { ...d, apyPercentage: primeApyPercentage } : d));

export const addUserPrimeApys = async ({
  assets,
  mutatedVTokenAddresses,
  accountAddress,
  publicClient,
  primeContractAddress,
  userXvsStakedMantissa,
}: {
  assets: Asset[];
  mutatedVTokenAddresses: Address[];
  accountAddress: Address;
  publicClient: PublicClient;
  primeContractAddress: Address;
  userXvsStakedMantissa: BigNumber;
}) => {
  const formattedAssets = await Promise.all(
    assets.map(async asset => {
      if (!mutatedVTokenAddresses.includes(asset.vToken.address.toLowerCase() as Address)) {
        return asset;
      }

      const simulatedPrimeAprs = await publicClient.readContract({
        abi: primeAbi,
        address: primeContractAddress,
        functionName: 'estimateAPR',
        args: [
          asset.vToken.address,
          accountAddress,
          toMantissa({
            value: asset.userBorrowBalanceTokens,
            token: asset.vToken.underlyingToken,
          }),
          toMantissa({
            value: asset.userSupplyBalanceTokens,
            token: asset.vToken.underlyingToken,
          }),
          BigInt(userXvsStakedMantissa.toFixed()),
        ],
      });

      const supplyApyPercentage = convertAprBipsToApy({
        aprBips: simulatedPrimeAprs.supplyAPR.toString(),
      });

      const borrowApyPercentage = convertAprBipsToApy({
        aprBips: simulatedPrimeAprs.borrowAPR.toString(),
      });

      return {
        ...asset,
        supplyTokenDistributions: updatePrimeDistribution({
          distributions: asset.supplyTokenDistributions,
          primeApyPercentage: supplyApyPercentage,
        }),
        borrowTokenDistributions: updatePrimeDistribution({
          distributions: asset.borrowTokenDistributions,
          primeApyPercentage: borrowApyPercentage,
        }),
      };
    }),
  );

  return { assets: formattedAssets };
};
