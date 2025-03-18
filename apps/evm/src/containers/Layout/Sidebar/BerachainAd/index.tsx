import { Suspense } from 'react';
import { safeLazyLoad } from 'utilities/safeLazyLoad';

const BerachainAdComponent = safeLazyLoad(() => import('./Component'));

export const BerachainAd: React.FC = () => (
  <Suspense>
    <BerachainAdComponent />
  </Suspense>
);
