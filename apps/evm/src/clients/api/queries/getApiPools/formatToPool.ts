import { ChainId } from 'types';
import { areAddressesEqual, formatToMarket } from 'utilities';
import type { ApiPoolData } from '.';

interface FormatToPoolInput {
  apiPoolData: ApiPoolData;
  corePoolComptrollerContractAddress: string;
  chainId: ChainId;
}

const formatToPool = ({
  apiPoolData,
  corePoolComptrollerContractAddress,
  chainId,
}: FormatToPoolInput) => ({
  address: apiPoolData.address,
  name: apiPoolData.name,
  description: apiPoolData.description ?? '',
  isIsolated:
    chainId === ChainId.BSC_MAINNET || chainId === ChainId.BSC_TESTNET
      ? !areAddressesEqual(corePoolComptrollerContractAddress, apiPoolData.address)
      : true,
  markets: apiPoolData.markets.map(apiMarket => formatToMarket({ apiMarket })),
});

export default formatToPool;
