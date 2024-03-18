import { BSC_MAINNET_UNLISTED_TOKEN_ADDRESSES } from 'constants/address';
import type { LegacyPoolComptroller, PoolLens, VenusLens } from 'libs/contracts';
import { logError } from 'libs/errors';
import { ChainId, type Token, type VToken } from 'types';
import { areAddressesEqual } from 'utilities';
import findTokenByAddress from 'utilities/findTokenByAddress';

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

const getVTokens = async ({
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
    // Temporarily remove unlisted tokens that have not been updated from the contract side yet.
    // TODO: remove this logic once these tokens have been unlisted from contracts
    if (
      chainId === ChainId.BSC_MAINNET &&
      BSC_MAINNET_UNLISTED_TOKEN_ADDRESSES.some(unlistedTokenAddress =>
        areAddressesEqual(unlistedTokenAddress, metaData.underlyingAssetAddress),
      )
    ) {
      return acc;
    }

    // Remove unlisted tokens
    if (!metaData.isListed) {
      return acc;
    }

    const underlyingToken = findTokenByAddress({
      tokens,
      address: metaData.underlyingAssetAddress,
    });

    if (!underlyingToken) {
      logError(`Record missing for token: ${metaData.underlyingAssetAddress}`);
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
