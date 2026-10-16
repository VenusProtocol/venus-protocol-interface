import * as Sentry from '@sentry/react';
import { useTranslation } from 'libs/translations';

import { ErrorState } from '../ErrorState';

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
