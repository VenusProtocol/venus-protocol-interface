/** @jsxImportSource @emotion/react */
import { useChainId } from 'libs/wallet';
import { useParams } from 'react-router-dom';

import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { ChainId } from 'types';

import Market from '..';
import MarketLoader from '../MarketLoader';

const CorePoolMarket: React.FC = () => {
  const { vTokenAddress } = useParams();
  const { chainId } = useChainId();
  const isBnbChain = chainId === ChainId.BSC_MAINNET || chainId === ChainId.BSC_TESTNET;
  const { corePoolComptrollerContractAddress } = useGetChainMetadata();

  return (
    <MarketLoader
      poolComptrollerAddress={corePoolComptrollerContractAddress}
      vTokenAddress={vTokenAddress}
      isIsolatedPoolMarket={!isBnbChain}
    >
      {marketProps => <Market {...marketProps} />}
    </MarketLoader>
  );
};

export default CorePoolMarket;
