import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import Pool from '..';

const StakedEthPool: React.FC = () => {
  const { stakedEthPoolComptrollerContractAddress = '' } = useGetChainMetadata();

  return <Pool poolComptrollerAddress={stakedEthPoolComptrollerContractAddress} />;
};

export default StakedEthPool;
