/** @jsxImportSource @emotion/react */
import { useParams } from 'react-router-dom';

import { useGetChainMetadata } from 'hooks/useGetChainMetadata';

import MarketLoader from 'containers/MarketLoader';
import { Market } from '../Market';

const CorePoolMarket: React.FC = () => {
  const { vTokenAddress } = useParams();
  const { corePoolComptrollerContractAddress } = useGetChainMetadata();

  return (
    <MarketLoader
      poolComptrollerAddress={corePoolComptrollerContractAddress}
      vTokenAddress={vTokenAddress}
    >
      {marketProps => <Market {...marketProps} />}
    </MarketLoader>
  );
};

export default CorePoolMarket;
