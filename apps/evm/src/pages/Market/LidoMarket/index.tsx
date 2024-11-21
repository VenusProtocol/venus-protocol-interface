import MarketLoader from 'containers/MarketLoader';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { Page } from '../Page';

const LidoMarket: React.FC = () => {
  const { lstPoolComptrollerContractAddress, lstPoolVWstEthContractAddress } =
    useGetChainMetadata();

  return (
    <MarketLoader
      poolComptrollerAddress={lstPoolComptrollerContractAddress}
      vTokenAddress={lstPoolVWstEthContractAddress}
    >
      {marketProps => <Page {...marketProps} />}
    </MarketLoader>
  );
};

export default LidoMarket;
