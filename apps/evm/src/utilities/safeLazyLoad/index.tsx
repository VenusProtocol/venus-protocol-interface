import { type FC, lazy } from 'react';

export const safeLazyLoad = (
  load: () => Promise<{
    default: FC<{ [k: string]: never }>;
  }>,
) =>
  lazy(async () => {
    try {
      const result = await load();
      return result;
    } catch (_e) {
      // Reload the page if the module fails to load, as this indicates a new version of the dApp
      // has been deployed
      window.location.reload();

      return { default: () => <></> };
    }
  });
