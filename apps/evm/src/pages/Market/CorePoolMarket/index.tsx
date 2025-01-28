/** @jsxImportSource @emotion/react */
import { useParams } from 'react-router-dom';

import { useGetChainMetadata } from 'hooks/useGetChainMetadata';

import MarketLoader from 'containers/MarketLoader';
import type { Address } from 'viem';
import { Page } from '../Page';

const CorePoolMarket: React.FC = () => {
  const { vTokenAddress } = useParams<{
    vTokenAddress: Address;
  }>();
  const { corePoolComptrollerContractAddress } = useGetChainMetadata();

  return (
    <MarketLoader
      poolComptrollerAddress={corePoolComptrollerContractAddress}
      vTokenAddress={vTokenAddress}
    >
      {marketProps => <Page {...marketProps} />}
    </MarketLoader>
  );
};

export default CorePoolMarket;
