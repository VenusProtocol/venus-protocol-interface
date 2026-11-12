import { isProOnlyPathname } from 'hooks/useInterfaceMode/store';

export type OnboardingVariant = 'lite' | 'pro';

export const getOnboardingVariant = ({
  pathname,
  isLite,
}: {
  pathname: string;
  isLite: boolean;
}): OnboardingVariant | undefined => {
  if (isProOnlyPathname(pathname)) {
    return 'lite';
  }

  if (isLite && (pathname.replace(/\/$/, '') || '/') === '/') {
    return 'pro';
  }

  return undefined;
};
