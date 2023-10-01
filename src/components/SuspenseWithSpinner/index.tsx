import React, { Suspense } from 'react';

import { Spinner } from 'components/Spinner';

export interface SuspenseWithSpinnerProps {
  children: React.ReactNode;
}

export const SuspenseWithSpinner: React.FC<SuspenseWithSpinnerProps> = ({ children }) => (
  <Suspense fallback={<Spinner />}>{children}</Suspense>
);
