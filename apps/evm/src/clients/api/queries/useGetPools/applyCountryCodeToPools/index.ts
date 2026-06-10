import type { GetPoolsOutput } from '../types';
import type { ApiTokenMetadata } from '../useGetPoolsQuery/getPools/getApiPools';

export const applyCountryCodeToPools = ({
  countryCode,
  pools,
  tokenMetadataMapping,
}: {
  countryCode?: string;
  pools: GetPoolsOutput['pools'];
  tokenMetadataMapping: Record<string, ApiTokenMetadata>;
}): GetPoolsOutput['pools'] => {
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
