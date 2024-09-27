import { NATIVE_TOKEN_ADDRESS, NULL_ADDRESS } from 'constants/address';
import type { LegacyPoolComptroller, PoolLens, VenusLens } from 'libs/contracts';
import type { Token, VToken } from 'types';
import { areAddressesEqual } from 'utilities';
import findTokenByAddress from 'utilities/findTokenByAddress';

export interface GetVTokensInput {
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

const getVTokens = async ({
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

  const vTokenMetadata = isolatedPools.reduce<
    {
      vToken: string;
      isListed: boolean;
      underlyingAssetAddress: string;
    }[]
  >((acc, isolatedPool) => acc.concat(isolatedPool.vTokens), []);

  // Fetch vToken meta data from core pool (this is only relevant to the BSC network)
  if (legacyPoolVTokenAddresses && venusLensContract) {
    const legacyPoolVTokenMetadata =
      await venusLensContract.callStatic.vTokenMetadataAll(legacyPoolVTokenAddresses);

    vTokenMetadata.push(...legacyPoolVTokenMetadata);
  }

  // Shape meta data into vToken
  const vTokens = vTokenMetadata.reduce<VToken[]>((acc, metaData) => {
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
      address: metaData.vToken,
      decimals: 8,
      symbol: `v${underlyingToken.symbol}`,
      underlyingToken,
    };

    return [...acc, vToken];
  }, []);

  return {
    vTokens,
  };
};

export default getVTokens;
