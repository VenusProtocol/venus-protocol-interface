import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import Pool from '..';

const LidoPool: React.FC = () => {
  const { lidoPoolComptrollerContractAddress = '' } = useGetChainMetadata();

  return <Pool poolComptrollerAddress={lidoPoolComptrollerContractAddress} />;
};

export default LidoPool;
