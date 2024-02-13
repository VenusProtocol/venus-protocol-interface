import { BSC_MAINNET_CAN_ADDRESS } from 'constants/address';
import { LegacyPoolComptroller, PoolLens, VenusLens } from 'libs/contracts';
import { logError } from 'libs/errors';
import { Token, VToken } from 'types';
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

  const vTokenMetaData = isolatedPools.reduce<
    {
      vToken: string;
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
    // Temporary workaround to filter out CAN
    if (areAddressesEqual(metaData.underlyingAssetAddress, BSC_MAINNET_CAN_ADDRESS)) {
      // TODO: remove once a more generic solution has been integrated on the contract side
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
