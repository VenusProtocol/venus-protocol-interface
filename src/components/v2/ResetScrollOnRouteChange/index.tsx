import React, { useEffect } from 'react';
import { useLocation } from 'react-router';

export const ResetScrollOnRouteChange: React.FC = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return <>{children}</>;
};
