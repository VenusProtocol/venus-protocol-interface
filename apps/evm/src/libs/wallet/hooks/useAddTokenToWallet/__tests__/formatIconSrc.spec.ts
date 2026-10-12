import { formatIconSrc } from '../formatIconSrc';

describe('formatIconSrc', () => {
  it('leaves an inlined data: URI untouched', () => {
    const iconSrc = 'data:image/svg+xml,%3csvg%3e%3c/svg%3e';

    expect(formatIconSrc({ iconSrc })).toBe(iconSrc);
  });

  it('leaves an absolute URL untouched', () => {
    const iconSrc = 'https://cdn.venus.io/tokens/xvs.png';

    expect(formatIconSrc({ iconSrc })).toBe(iconSrc);
  });

  it('resolves a root-relative path against the app origin', () => {
    expect(formatIconSrc({ iconSrc: '/assets/xvs-BlwoM1M5.png' })).toBe(
      `${window.location.origin}/assets/xvs-BlwoM1M5.png`,
    );
  });
});
