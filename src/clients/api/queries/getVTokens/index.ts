import { ContractTypeByName } from 'packages/contracts';
import { VToken } from 'types';
import { getTokenByAddress } from 'utilities';

import { logError } from 'context/ErrorLogger';

export interface GetVTokensInput {
  poolLensContract: ContractTypeByName<'poolLens'>;
  poolRegistryContractAddress: string;
  // The VenusLens and main pool Comptroller contract only exists on the BSC network
  venusLensContract?: ContractTypeByName<'venusLens'>;
  mainPoolComptrollerContract?: ContractTypeByName<'mainPoolComptroller'>;
}

export type GetVTokensOutput = {
  vTokens: VToken[];
};

const getVTokens = async ({
  poolLensContract,
  poolRegistryContractAddress,
  venusLensContract,
  mainPoolComptrollerContract,
}: GetVTokensInput): Promise<GetVTokensOutput> => {
  // Fetch vToken meta data from isolated pools
  const [isolatedPools, mainPoolVTokenAddresses] = await Promise.all([
    poolLensContract.getAllPools(poolRegistryContractAddress),
    mainPoolComptrollerContract ? mainPoolComptrollerContract.getAllMarkets() : undefined,
  ]);

  const vTokenMetaData = isolatedPools.reduce<
    {
      vToken: string;
      underlyingAssetAddress: string;
    }[]
  >((acc, isolatedPool) => acc.concat(isolatedPool.vTokens), []);

  // Fetch vToken meta data from main pool (this is only relevant to the BSC network)
  if (mainPoolVTokenAddresses && venusLensContract) {
    const mainPoolVTokenMetaData =
      await venusLensContract.callStatic.vTokenMetadataAll(mainPoolVTokenAddresses);

    vTokenMetaData.push(...mainPoolVTokenMetaData);
  }

  // Shape meta data into vToken
  const vTokens = vTokenMetaData.reduce<VToken[]>((acc, metaData) => {
    const underlyingToken = getTokenByAddress(metaData.underlyingAssetAddress);

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
