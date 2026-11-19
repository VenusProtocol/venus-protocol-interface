import type { IosRisk } from 'types';
import { getIosRisk } from 'utilities/getIosRisk';

export const detectIosRisk = (): IosRisk | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return getIosRisk({
    userAgent: window.navigator.userAgent,
    maxTouchPoints: window.navigator.maxTouchPoints ?? 0,
    supportsWebKit26: !!window.CSS?.supports?.('anchor-name', '--x'),
  });
};
