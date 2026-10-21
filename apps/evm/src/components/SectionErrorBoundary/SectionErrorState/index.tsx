import { useTranslation } from 'libs/translations';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

import { ErrorState } from '../../ErrorState';

export interface SectionErrorStateProps {
  resetError: () => void;
  message?: string;
  className?: string;
}

export const SectionErrorState: React.FC<SectionErrorStateProps> = ({
  resetError,
  message,
  className,
}) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const failedPathnameRef = useRef(pathname);

  // Navigating away from the failed page clears the error
  useEffect(() => {
    if (pathname !== failedPathnameRef.current) {
      resetError();
    }
  }, [pathname, resetError]);

  return (
    <ErrorState
      className={className}
      message={message}
      button={{ label: t('errorState.buttonLabel'), onClick: () => resetError() }}
    />
  );
};
