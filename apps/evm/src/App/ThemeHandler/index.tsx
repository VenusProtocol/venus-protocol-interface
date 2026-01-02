import { useIsOnUnichain } from 'hooks/useIsOnUnichain';

import { useEffect } from 'react';

export const ThemeHandler: React.FC = () => {
  const isOnUnichain = useIsOnUnichain();

  // Change theme based on active chain
  useEffect(() => {
    document.documentElement.classList.remove('unichain-theme');

    if (isOnUnichain) {
      document.documentElement.classList.add('unichain-theme');
    }
  }, [isOnUnichain]);

  return undefined;
};
