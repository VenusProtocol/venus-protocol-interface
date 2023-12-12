import { useCallback } from 'react';
import { NavigateOptions, To, useNavigate as useRRNavigate } from 'react-router-dom';

import { useFormatTo } from 'hooks/useFormatTo';

// TODO: add tests

export const useNavigate = () => {
  const navigateRR = useRRNavigate();
  const formatTo = useFormatTo();

  const navigate = useCallback(
    (to: To, options?: NavigateOptions) => {
      const formattedTo = formatTo({ to });
      return navigateRR(formattedTo, options);
    },
    [navigateRR, formatTo],
  );

  return navigate;
};
