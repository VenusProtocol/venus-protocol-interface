import { useInterfaceMode } from 'hooks/useInterfaceMode';
import { useProHomePath } from 'hooks/useProHomePath';
import { useEffect } from 'react';
import { Navigate, useLocation, useNavigationType } from 'react-router';
import { safeLazyLoad } from 'utilities';
import PageSuspense from '../PageSuspense';

const Lite = safeLazyLoad(() => import('pages/Lite'));

export const HomeRoute: React.FC = () => {
  const { isLite, setMode } = useInterfaceMode();
  const proHomePath = useProHomePath();
  const { search, state } = useLocation();
  const navigationType = useNavigationType();
  const isReturningToLite = !isLite && navigationType === 'POP' && !!state?.liteEntry;

  useEffect(() => {
    if (isReturningToLite) {
      setMode('lite');
    }
  }, [isReturningToLite, setMode]);

  if (isReturningToLite) {
    return undefined;
  }

  if (!isLite) {
    return <Navigate replace to={{ pathname: proHomePath, search }} />;
  }

  return (
    <PageSuspense>
      <Lite />
    </PageSuspense>
  );
};
