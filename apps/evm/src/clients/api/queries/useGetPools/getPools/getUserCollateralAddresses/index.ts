import {
  type IsolatedPoolComptroller,
  type LegacyPoolComptroller,
  getIsolatedPoolComptrollerContract,
} from 'libs/contracts';
import type { Provider } from 'libs/wallet';
import type { ChainId } from 'types';
import { isPoolIsolated } from 'utilities';
import type { ApiPool } from '../getApiPools';

export const getUserCollateralAddresses = async ({
  accountAddress,
  apiPools,
  chainId,
  provider,
  legacyPoolComptrollerContract,
}: {
  accountAddress: string;
  apiPools: ApiPool[];
  chainId: ChainId;
  provider: Provider;
  legacyPoolComptrollerContract?: LegacyPoolComptroller;
}) => {
  const getAssetsInPromises: ReturnType<IsolatedPoolComptroller['getAssetsIn']>[] = [];

  apiPools.forEach(pool => {
    const isIsolated = isPoolIsolated({
      chainId,
      comptrollerAddress: pool.address,
    });

    if (!isIsolated) {
      return;
    }

    const comptrollerContract = getIsolatedPoolComptrollerContract({
      signerOrProvider: provider,
      address: pool.address,
    });

    if (accountAddress) {
      getAssetsInPromises.push(comptrollerContract.getAssetsIn(accountAddress));
    }
  });

  if (accountAddress && legacyPoolComptrollerContract) {
    getAssetsInPromises.push(legacyPoolComptrollerContract.getAssetsIn(accountAddress));
  }

  const results = await Promise.all(getAssetsInPromises);

  return { userCollateralAddresses: results.flat() };
};
