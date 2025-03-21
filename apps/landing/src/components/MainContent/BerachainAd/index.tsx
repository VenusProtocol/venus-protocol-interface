import { Suspense, lazy } from 'react';

const BerachainAdComponent = lazy(() => import('./Component'));

export const BerachainAd: React.FC = () => (
  <Suspense>
    <BerachainAdComponent />
  </Suspense>
);
