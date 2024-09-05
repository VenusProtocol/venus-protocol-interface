import { ChainId, type Token } from 'types';
import { areAddressesEqual } from 'utilities';
import type { ApiPoolData } from '.';
import formatToMarket from '../getApiMarkets/formatToMarket';

interface FormatToPoolInput {
  apiPoolData: ApiPoolData;
  corePoolComptrollerContractAddress: string;
  chainId: ChainId;
  xvs: Token;
}

const formatToPool = ({
  apiPoolData,
  corePoolComptrollerContractAddress,
  xvs,
  chainId,
}: FormatToPoolInput) => ({
  address: apiPoolData.address,
  name: apiPoolData.name,
  description: apiPoolData.description ?? '',
  isIsolated:
    chainId === ChainId.BSC_MAINNET || chainId === ChainId.BSC_TESTNET
      ? !areAddressesEqual(corePoolComptrollerContractAddress, apiPoolData.address)
      : true,
  markets: apiPoolData.markets.map(apiMarket => formatToMarket({ apiMarket, xvs })),
});

export default formatToPool;
