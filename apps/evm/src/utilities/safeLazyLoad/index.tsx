import { type FC, lazy } from 'react';

import config from 'config';

export const safeLazyLoad = (
  load: () => Promise<{
    default: FC<{ [k: string]: never }>;
  }>,
) =>
  lazy(async () => {
    try {
      const result = await load();
      return result;
    } catch (error) {
      if (config.environment === 'local') {
        console.error(error);
      } else {
        // Reload the page if the module fails to load, as this indicates a new version of the dApp
        // has been deployed
        window.location.reload();
      }

      return { default: () => <></> };
    }
  });
