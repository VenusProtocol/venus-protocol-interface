import { useIsOnUnichain } from 'hooks/useIsOnUnichain';

import { useEffect } from 'react';

export const ThemeHandler: React.FC = () => {
  const isOnUnichain = useIsOnUnichain();

  // Change theme based on active chain
  useEffect(() => {
    document.body.classList.remove('unichain-theme');

    if (isOnUnichain) {
      document.body.classList.add('unichain-theme');
    }
  }, [isOnUnichain]);

  return undefined;
};
