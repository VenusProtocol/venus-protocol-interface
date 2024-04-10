/** @jsxImportSource @emotion/react */
import { useParams } from 'react-router-dom';

import MarketLoader from 'containers/MarketLoader';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { Market } from '../Market';
import MarketOld from '../MarketOld';

const IsolatedPoolMarket: React.FC = () => {
  const { vTokenAddress, poolComptrollerAddress } = useParams();
  const isNewMarketPageEnabled = useIsFeatureEnabled({ name: 'newMarketPage' });

  return (
    <MarketLoader
      poolComptrollerAddress={poolComptrollerAddress}
      vTokenAddress={vTokenAddress}
      isIsolatedPoolMarket
    >
      {marketProps =>
        isNewMarketPageEnabled ? <Market {...marketProps} /> : <MarketOld {...marketProps} />
      }
    </MarketLoader>
  );
};

export default IsolatedPoolMarket;
