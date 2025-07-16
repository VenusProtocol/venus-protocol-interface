import type { ChainId } from '@venusprotocol/chains/types';
import { type Address, type MulticallContracts, type PublicClient, erc4626Abi } from 'viem';

import { VError } from 'libs/errors';
import type { ImportableMorphoSupplyPosition } from 'types';
import { getMorphoSubgraphUserPositions } from './getMorphoSubgraphUserPositions';

// TODO: add tests

export interface GetImportableMorphoSupplyPositionsInput {
  accountAddress: Address;
  chainId: ChainId;
  publicClient: PublicClient;
}

export interface GetImportableMorphoSupplyPositionsOutput {
  importableSupplyPositions: ImportableMorphoSupplyPosition[];
}

export const getImportableMorphoSupplyPositions = async ({
  chainId,
  accountAddress,
  publicClient,
}: GetImportableMorphoSupplyPositionsInput): Promise<GetImportableMorphoSupplyPositionsOutput> => {
  const importableSupplyPositions: ImportableMorphoSupplyPosition[] = [];

  try {
    const subgraphUserPositions = await getMorphoSubgraphUserPositions({ accountAddress, chainId });

    // Fetch actual user balances (the subgraph has some delay)
    const contractBalances = await publicClient.multicall({
      contracts: subgraphUserPositions.userByAddress.vaultPositions.reduce<
        MulticallContracts<unknown[]>
      >(
        (acc, vaultPosition) => [
          ...acc,
          {
            address: vaultPosition.vault.address,
            abi: erc4626Abi,
            functionName: 'balanceOf',
            args: [accountAddress],
          },
          {
            address: vaultPosition.vault.address,
            abi: erc4626Abi,
            functionName: 'totalAssets',
          },
          {
            address: vaultPosition.vault.address,
            abi: erc4626Abi,
            functionName: 'totalSupply',
          },
        ],
        [],
      ),
    });

    subgraphUserPositions.userByAddress.vaultPositions.forEach((vaultPosition, index) => {
      const balanceIndex = index * 3; // We make 3 requests per vault
      const userVaultTokenBalanceMantissa = contractBalances[balanceIndex].result as
        | undefined
        | bigint;

      const vaultTotalAssets = contractBalances[balanceIndex + 1].result as bigint | undefined;
      const vaultTotalSupply = contractBalances[balanceIndex + 2].result as bigint | undefined;

      // Skip empty user positions and positions for which pool doesn't have enough liquidity
      // available to withdraw
      if (
        !vaultPosition.state ||
        vaultPosition.vault.liquidity.underlying < vaultPosition.state.assets ||
        !userVaultTokenBalanceMantissa ||
        !vaultTotalAssets ||
        !vaultTotalSupply
      ) {
        return;
      }

      const userSupplyBalanceMantissa =
        (userVaultTokenBalanceMantissa * vaultTotalAssets) / vaultTotalSupply;

      const importableSupplyPosition: ImportableMorphoSupplyPosition = {
        protocol: 'morpho',
        tokenAddress: vaultPosition.vault.asset.address,
        userSupplyBalanceMantissa,
        supplyApyPercentage: vaultPosition.vault.state.netApy * 100,
        vaultAddress: vaultPosition.vault.address,
        userVaultTokenBalanceMantissa,
      };

      importableSupplyPositions.push(importableSupplyPosition);
    });
  } catch (error: any) {
    // Simply return no results if the error returned is because user has no positions
    if (error.response.errors?.[0].status !== 'NOT_FOUND') {
      throw new VError({
        type: 'unexpected',
        code: 'somethingWentWrong',
      });
    }
  }

  return {
    importableSupplyPositions,
  };
};
