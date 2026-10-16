import type { VToken } from 'types';
import type { ApiTokenMetadata } from '../useGetPoolsQuery/getPools/getApiPools';

interface CountryGatedAsset {
  vToken: VToken;
  isRestricted: boolean;
  isGated: boolean;
}

export const applyCountryCodeToPools = <TPool extends { assets: CountryGatedAsset[] }>({
  countryCode,
  pools,
  tokenMetadataMapping,
}: {
  countryCode?: string;
  pools: TPool[];
  tokenMetadataMapping: Record<string, ApiTokenMetadata>;
}): TPool[] => {
  if (!countryCode) {
    return pools;
  }

  return pools.map(pool => ({
    ...pool,
    assets: pool.assets.map(asset => {
      const tokenMetadata =
        tokenMetadataMapping[asset.vToken.underlyingToken.address.toLowerCase()];
      const isRestricted = !!tokenMetadata?.restrictedCountries?.includes(countryCode);
      const isGated = !!tokenMetadata?.gatedCountries?.includes(countryCode);

      return {
        ...asset,
        isRestricted,
        isGated,
      };
    }),
  }));
};
