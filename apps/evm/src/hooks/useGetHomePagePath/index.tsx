import { routes } from 'constants/routing';
import { useChain } from 'hooks/useChain';

export const useGetHomePagePath = () => {
  const { corePoolComptrollerContractAddress } = useChain();

  const homePagePath = routes.pool.path.replace(
    ':poolComptrollerAddress',
    corePoolComptrollerContractAddress,
  );

  return { homePagePath };
};
