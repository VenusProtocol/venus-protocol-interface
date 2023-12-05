/** @jsxImportSource @emotion/react */
import { useParams } from 'react-router-dom';

import { useGetChainMetadata } from 'hooks/useGetChainMetadata';

import Market from '..';
import MarketLoader from '../MarketLoader';

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
