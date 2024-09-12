import MarketLoader from 'containers/MarketLoader';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { Market } from '../Market';

const LidoMarket: React.FC = () => {
  const { lstPoolComptrollerContractAddress, lstPoolVWstEthContractAddress } =
    useGetChainMetadata();

  return (
    <MarketLoader
      poolComptrollerAddress={lstPoolComptrollerContractAddress}
      vTokenAddress={lstPoolVWstEthContractAddress}
    >
      {marketProps => <Market {...marketProps} />}
    </MarketLoader>
  );
};

export default LidoMarket;
