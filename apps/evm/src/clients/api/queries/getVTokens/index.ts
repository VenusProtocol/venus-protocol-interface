import { NATIVE_TOKEN_ADDRESS, NULL_ADDRESS } from 'constants/address';
import { legacyPoolComptrollerAbi, poolLensAbi, venusLensAbi } from 'libs/contracts';
import { getVTokenAsset } from 'libs/tokens';
import type { ChainId, Token, VToken } from 'types';
import { areAddressesEqual } from 'utilities';
import findTokenByAddress from 'utilities/findTokenByAddress';
import type { Address, PublicClient } from 'viem';

export interface GetVTokensInput {
  publicClient: PublicClient;
  chainId: ChainId;
  tokens: Token[];
  poolLensContractAddress: Address;
  poolRegistryContractAddress: Address;
  // The VenusLens and core pool Comptroller contract only exists on the BSC network
  venusLensContractAddress?: Address;
  legacyPoolComptrollerContractAddress?: Address;
}

export type GetVTokensOutput = {
  vTokens: VToken[];
};

export const getVTokens = async ({
  publicClient,
  chainId,
  tokens,
  poolLensContractAddress,
  poolRegistryContractAddress,
  venusLensContractAddress,
  legacyPoolComptrollerContractAddress,
}: GetVTokensInput): Promise<GetVTokensOutput> => {
  // Fetch vToken meta data from isolated pools
  const [isolatedPools, legacyPoolVTokenAddresses] = await Promise.all([
    publicClient.readContract({
      address: poolLensContractAddress,
      abi: poolLensAbi,
      functionName: 'getAllPools',
      args: [poolRegistryContractAddress],
    }),
    legacyPoolComptrollerContractAddress
      ? publicClient.readContract({
          address: legacyPoolComptrollerContractAddress,
          abi: legacyPoolComptrollerAbi,
          functionName: 'getAllMarkets',
        })
      : undefined,
  ]);

  const vTokenMetaData = isolatedPools.reduce<
    {
      vToken: string;
      isListed: boolean;
      underlyingAssetAddress: string;
    }[]
  >((acc, isolatedPool) => acc.concat(isolatedPool.vTokens), []);

  // Fetch vToken meta data from core pool (this is only relevant to the BSC network)
  if (legacyPoolVTokenAddresses && venusLensContractAddress) {
    const { result: legacyPoolVTokenMetaData } = await publicClient.simulateContract({
      address: venusLensContractAddress,
      abi: venusLensAbi,
      functionName: 'vTokenMetadataAll',
      args: [legacyPoolVTokenAddresses],
    });

    vTokenMetaData.push(...legacyPoolVTokenMetaData);
  }

  // Shape meta data into vToken
  const vTokens = vTokenMetaData.reduce<VToken[]>((acc, metaData) => {
    // Remove unlisted tokens
    if (!metaData.isListed) {
      return acc;
    }

    const underlyingToken = findTokenByAddress({
      tokens,
      address:
        // If underlying asset address is the null address, this means the VToken has no underlying
        // token because it is a native token
        areAddressesEqual(metaData.underlyingAssetAddress, NULL_ADDRESS)
          ? NATIVE_TOKEN_ADDRESS
          : metaData.underlyingAssetAddress,
    });

    if (!underlyingToken) {
      return acc;
    }

    const vToken: VToken = {
      address: metaData.vToken as Address,
      decimals: 8,
      symbol: `v${underlyingToken.symbol}`,
      underlyingToken,
      asset: getVTokenAsset({
        chainId,
        vTokenAddress: metaData.vToken,
      }),
    };

    return [...acc, vToken];
  }, []);

  return {
    vTokens,
  };
};
