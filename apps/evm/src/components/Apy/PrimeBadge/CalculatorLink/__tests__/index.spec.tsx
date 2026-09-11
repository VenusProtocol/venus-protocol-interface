import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { renderComponent } from 'testUtils/render';
import type { Mock } from 'vitest';
import { CalculatorLink } from '..';

vi.mock('hooks/useIsFeatureEnabled', () => ({
  useIsFeatureEnabled: vi.fn(),
}));

const fakeVTokenAddress = '0xfD5840Cd36d94D7229439859C0112a4185BC0255';

describe('CalculatorLink', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Mock).mockReturnValue(true);
  });

  it('preselects the market it belongs to', () => {
    const { container } = renderComponent(<CalculatorLink vTokenAddress={fakeVTokenAddress} />);

    expect(container.querySelector('a')?.getAttribute('href')).toContain(
      `tokenAddress=${fakeVTokenAddress}`,
    );
  });

  it('links to the calculator without a market when it belongs to none', () => {
    const { container } = renderComponent(<CalculatorLink />);

    const href = container.querySelector('a')?.getAttribute('href');
    expect(href).toBeTruthy();
    expect(href).not.toContain('tokenAddress');
  });

  it('falls back to the documentation when the calculator is disabled', () => {
    (useIsFeatureEnabled as Mock).mockReturnValue(false);

    const { container } = renderComponent(<CalculatorLink vTokenAddress={fakeVTokenAddress} />);

    expect(container.querySelector('a')?.getAttribute('href')).toContain('docs');
  });
});
