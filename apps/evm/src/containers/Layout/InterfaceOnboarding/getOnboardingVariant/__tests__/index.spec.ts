import { routes } from 'constants/routing';

import { getOnboardingVariant } from '..';

describe('getOnboardingVariant', () => {
  it('introduces Pro when entering the Lite home page', () => {
    expect(getOnboardingVariant({ pathname: '/', isLite: true })).toBe('pro');
  });

  it('introduces Lite when entering a Pro page', () => {
    expect(getOnboardingVariant({ pathname: routes.liquidityHubs.path, isLite: false })).toBe(
      'lite',
    );
    expect(getOnboardingVariant({ pathname: '/markets/0x123', isLite: false })).toBe('lite');
  });

  it('does not introduce anything when the home page redirects to Pro', () => {
    expect(getOnboardingVariant({ pathname: '/', isLite: false })).toBeUndefined();
  });

  it('does not introduce anything on mode agnostic pages', () => {
    expect(getOnboardingVariant({ pathname: routes.dashboard.path, isLite: true })).toBeUndefined();
    expect(
      getOnboardingVariant({ pathname: routes.termsOfUse.path, isLite: false }),
    ).toBeUndefined();
  });
});
