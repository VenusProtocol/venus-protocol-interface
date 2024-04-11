import { useParams } from 'react-router-dom';

import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';

import MarketLoader from 'containers/MarketLoader';
import { Market } from '../Market';
import MarketOld from '../MarketOld';

const LidoPoolMarket: React.FC = () => {
  const { vTokenAddress } = useParams();
  const { lidoPoolComptrollerContractAddress = '' } = useGetChainMetadata();
  const isNewMarketPageEnabled = useIsFeatureEnabled({ name: 'newMarketPage' });

  return (
    <MarketLoader
      poolComptrollerAddress={lidoPoolComptrollerContractAddress}
      vTokenAddress={vTokenAddress}
      isIsolatedPoolMarket
    >
      {marketProps =>
        isNewMarketPageEnabled ? <Market {...marketProps} /> : <MarketOld {...marketProps} />
      }
    </MarketLoader>
  );
};

export default LidoPoolMarket;
