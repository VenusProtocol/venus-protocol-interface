import { type NavigateOptions, type To, useNavigate as useRRNavigate } from 'react-router';

import { useFormatTo } from 'hooks/useFormatTo';

export const useNavigate = () => {
  const navigateRR = useRRNavigate();
  const { formatTo } = useFormatTo();

  const navigate = (to: To, options?: NavigateOptions) => {
    const formattedTo = formatTo({ to });
    return navigateRR(formattedTo, options);
  };

  return { navigate };
};
