import { Suspense } from 'react';

import { Spinner } from 'components';

export interface PageSuspenseProps {
  children: React.ReactNode;
}

const PageSuspense: React.FC<PageSuspenseProps> = ({ children }) => (
  <Suspense fallback={<Spinner />}>{children}</Suspense>
);

export default PageSuspense;
