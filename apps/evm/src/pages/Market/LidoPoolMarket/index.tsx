import { useParams } from 'react-router-dom';

import { useGetChainMetadata } from 'hooks/useGetChainMetadata';

import Market from '..';
import MarketLoader from '../MarketLoader';

const LidoPoolMarket: React.FC = () => {
  const { vTokenAddress } = useParams();
  const { lidoPoolComptrollerContractAddress = '' } = useGetChainMetadata();

  return (
    <MarketLoader
      poolComptrollerAddress={lidoPoolComptrollerContractAddress}
      vTokenAddress={vTokenAddress}
      isIsolatedPoolMarket
    >
      {marketProps => <Market {...marketProps} />}
    </MarketLoader>
  );
};

export default LidoPoolMarket;
