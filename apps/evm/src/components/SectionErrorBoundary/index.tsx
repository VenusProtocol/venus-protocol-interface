import * as Sentry from '@sentry/react';

import { SectionErrorState } from './SectionErrorState';

export interface SectionErrorBoundaryProps {
  children?: React.ReactNode;
  message?: string;
  className?: string;
}

// Replaces only its own subtree when a child throws
export const SectionErrorBoundary: React.FC<SectionErrorBoundaryProps> = ({
  children,
  message,
  className,
}) => (
  <Sentry.ErrorBoundary
    fallback={({ resetError }) => (
      <SectionErrorState resetError={resetError} message={message} className={className} />
    )}
  >
    {children}
  </Sentry.ErrorBoundary>
);
