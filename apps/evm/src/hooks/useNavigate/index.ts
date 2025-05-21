import { useCallback } from 'react';
import { type NavigateOptions, type To, useNavigate as useRRNavigate } from 'react-router';

import { useFormatTo } from 'hooks/useFormatTo';

export const useNavigate = () => {
  const navigateRR = useRRNavigate();
  const { formatTo } = useFormatTo();

  const navigate = useCallback(
    (to: To, options?: NavigateOptions) => {
      const formattedTo = formatTo({ to });
      return navigateRR(formattedTo, options);
    },
    [navigateRR, formatTo],
  );

  return { navigate };
};
