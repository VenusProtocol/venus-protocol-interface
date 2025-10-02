import { routes } from 'constants/routing';
import { useGetChain } from 'hooks/useGetChain';

export const useGetHomePagePath = () => {
  const { corePoolComptrollerContractAddress } = useGetChain();

  const homePagePath = routes.pool.path.replace(
    ':poolComptrollerAddress',
    corePoolComptrollerContractAddress,
  );

  return { homePagePath };
};
