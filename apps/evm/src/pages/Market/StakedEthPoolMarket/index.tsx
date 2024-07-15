import { useParams } from 'react-router-dom';

import { useGetChainMetadata } from 'hooks/useGetChainMetadata';

import MarketLoader from 'containers/MarketLoader';
import { Market } from '../Market';

const StakedEthPoolMarket: React.FC = () => {
  const { vTokenAddress } = useParams();
  const { stakedEthPoolComptrollerContractAddress = '' } = useGetChainMetadata();

  return (
    <MarketLoader
      poolComptrollerAddress={stakedEthPoolComptrollerContractAddress}
      vTokenAddress={vTokenAddress}
    >
      {marketProps => <Market {...marketProps} />}
    </MarketLoader>
  );
};

export default StakedEthPoolMarket;
