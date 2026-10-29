import { useInterfaceMode } from 'hooks/useInterfaceMode';
import { useProHomePath } from 'hooks/useProHomePath';
import { Navigate, useLocation } from 'react-router';
import { safeLazyLoad } from 'utilities';
import PageSuspense from '../PageSuspense';

const Lite = safeLazyLoad(() => import('pages/Lite'));

export const HomeRoute: React.FC = () => {
  const { isLite } = useInterfaceMode();
  const proHomePath = useProHomePath();
  const { search } = useLocation();

  if (!isLite) {
    return <Navigate replace to={{ pathname: proHomePath, search }} />;
  }

  return (
    <PageSuspense>
      <Lite />
    </PageSuspense>
  );
};
