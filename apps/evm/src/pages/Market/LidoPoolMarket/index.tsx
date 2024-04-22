import { useParams } from 'react-router-dom';

import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';

import MarketLoader from 'containers/MarketLoader';
import { Market } from '../Market';
import MarketOld from '../MarketOld';

const StakedEthPoolMarket: React.FC = () => {
  const { vTokenAddress } = useParams();
  const { stakedEthPoolComptrollerContractAddress = '' } = useGetChainMetadata();
  const isNewMarketPageEnabled = useIsFeatureEnabled({ name: 'newMarketPage' });

  return (
    <MarketLoader
      poolComptrollerAddress={stakedEthPoolComptrollerContractAddress}
      vTokenAddress={vTokenAddress}
    >
      {marketProps =>
        isNewMarketPageEnabled ? <Market {...marketProps} /> : <MarketOld {...marketProps} />
      }
    </MarketLoader>
  );
};

export default StakedEthPoolMarket;
