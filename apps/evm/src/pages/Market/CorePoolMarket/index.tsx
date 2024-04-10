/** @jsxImportSource @emotion/react */
import { useParams } from 'react-router-dom';

import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useChainId } from 'libs/wallet';
import { ChainId } from 'types';

import MarketLoader from 'containers/MarketLoader';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { Market } from '../Market';
import MarketOld from '../MarketOld';

const CorePoolMarket: React.FC = () => {
  const { vTokenAddress } = useParams();
  const { chainId } = useChainId();
  const isBnbChain = chainId === ChainId.BSC_MAINNET || chainId === ChainId.BSC_TESTNET;
  const { corePoolComptrollerContractAddress } = useGetChainMetadata();
  const isNewMarketPageEnabled = useIsFeatureEnabled({ name: 'newMarketPage' });

  return (
    <MarketLoader
      poolComptrollerAddress={corePoolComptrollerContractAddress}
      vTokenAddress={vTokenAddress}
      isIsolatedPoolMarket={!isBnbChain}
    >
      {marketProps =>
        isNewMarketPageEnabled ? <Market {...marketProps} /> : <MarketOld {...marketProps} />
      }
    </MarketLoader>
  );
};

export default CorePoolMarket;
