import { NATIVE_TOKEN_ADDRESS, NULL_ADDRESS } from 'constants/address';
import type { LegacyPoolComptroller, PoolLens, VenusLens } from 'libs/contracts';
import { getVTokenAsset } from 'libs/tokens';
import type { ChainId, Token, VToken } from 'types';
import { areAddressesEqual } from 'utilities';
import findTokenByAddress from 'utilities/findTokenByAddress';
import type { Address } from 'viem';

export interface GetVTokensInput {
  chainId: ChainId;
  tokens: Token[];
  poolLensContract: PoolLens;
  poolRegistryContractAddress: string;
  // The VenusLens and core pool Comptroller contract only exists on the BSC network
  venusLensContract?: VenusLens;
  legacyPoolComptrollerContract?: LegacyPoolComptroller;
}

export type GetVTokensOutput = {
  vTokens: VToken[];
};

export const getVTokens = async ({
  chainId,
  tokens,
  poolLensContract,
  poolRegistryContractAddress,
  venusLensContract,
  legacyPoolComptrollerContract,
}: GetVTokensInput): Promise<GetVTokensOutput> => {
  // Fetch vToken meta data from isolated pools
  const [isolatedPools, legacyPoolVTokenAddresses] = await Promise.all([
    poolLensContract.getAllPools(poolRegistryContractAddress),
    legacyPoolComptrollerContract ? legacyPoolComptrollerContract.getAllMarkets() : undefined,
  ]);

  const vTokenMetaData = isolatedPools.reduce<
    {
      vToken: string;
      isListed: boolean;
      underlyingAssetAddress: string;
    }[]
  >((acc, isolatedPool) => acc.concat(isolatedPool.vTokens), []);

  // Fetch vToken meta data from core pool (this is only relevant to the BSC network)
  if (legacyPoolVTokenAddresses && venusLensContract) {
    const legacyPoolVTokenMetaData =
      await venusLensContract.callStatic.vTokenMetadataAll(legacyPoolVTokenAddresses);

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
