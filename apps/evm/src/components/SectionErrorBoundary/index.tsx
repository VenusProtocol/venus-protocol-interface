import * as Sentry from '@sentry/react';
import { useTranslation } from 'libs/translations';

import { ErrorState } from '../ErrorState';

export interface SectionErrorBoundaryProps {
  children?: React.ReactNode;
  message?: string;
  className?: string;
}

// Isolates a section of the page: when its subtree throws, only that section is replaced by an
// error state with a retry button, leaving the rest of the page usable.
// It relies on Sentry's boundary directly rather than on the app-level one, so that it can be
// dropped anywhere without requiring a QueryClient to be set up above it.
export const SectionErrorBoundary: React.FC<SectionErrorBoundaryProps> = ({
  children,
  message,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <Sentry.ErrorBoundary
      fallback={({ resetError }) => (
        <ErrorState
          className={className}
          message={message}
          button={{ label: t('errorState.buttonLabel'), onClick: () => resetError() }}
        />
      )}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
};
