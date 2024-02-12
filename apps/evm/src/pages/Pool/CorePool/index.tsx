import { useGetChainMetadata } from 'hooks/useGetChainMetadata';

import Pool from '..';

const CorePool: React.FC = () => {
  const { corePoolComptrollerContractAddress } = useGetChainMetadata();

  return <Pool poolComptrollerAddress={corePoolComptrollerContractAddress} />;
};

export default CorePool;
