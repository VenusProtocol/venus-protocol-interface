import { routes } from 'constants/routing';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';

export const useGetHomePagePath = () => {
  const { corePoolComptrollerContractAddress } = useGetChainMetadata();

  const homePagePath = routes.pool.path.replace(
    ':poolComptrollerAddress',
    corePoolComptrollerContractAddress,
  );

  return { homePagePath };
};
