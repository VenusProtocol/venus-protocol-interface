import { Spinner } from 'components';
import { Suspense } from 'react';
import * as React from 'react';

export interface PageSuspenseProps {
  children: React.ReactNode;
}

const PageSuspense: React.FC<PageSuspenseProps> = ({ children }) => (
  <Suspense fallback={<Spinner />}>{children}</Suspense>
);

export default PageSuspense;
