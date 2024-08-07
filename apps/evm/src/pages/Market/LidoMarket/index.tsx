import MarketLoader from 'containers/MarketLoader';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { Market } from '../Market';

const LidoMarket: React.FC = () => {
  const { stakedEthPoolComptrollerContractAddress, wstEthContractAddress } = useGetChainMetadata();

  return (
    <MarketLoader
      poolComptrollerAddress={stakedEthPoolComptrollerContractAddress}
      vTokenAddress={wstEthContractAddress}
    >
      {marketProps => <Market {...marketProps} />}
    </MarketLoader>
  );
};

export default LidoMarket;
