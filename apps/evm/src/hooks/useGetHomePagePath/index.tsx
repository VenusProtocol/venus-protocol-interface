import { routes } from 'constants/routing';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';

// TODO: add tests

export const useGetHomePagePath = () => {
  const { corePoolComptrollerContractAddress } = useGetChainMetadata();

  const homePagePath = routes.pool.path.replace(
    ':poolComptrollerAddress',
    corePoolComptrollerContractAddress,
  );

  return { homePagePath };
};
