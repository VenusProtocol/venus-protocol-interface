import type { Mock } from 'vitest';

import { useParams } from 'react-router';

import { routes } from 'constants/routing';
import { Redirect } from 'containers/Redirect';
import { renderComponent } from 'testUtils/render';

import { MarketRedirect } from '..';

vi.mock('react-router', async importOriginal => {
  const actual: Record<string, unknown> = await importOriginal();

  return {
    ...actual,
    useParams: vi.fn(),
  };
});

vi.mock('containers/Redirect', () => ({
  Redirect: vi.fn(({ to }: { to: string }) => <div data-testid="redirect">{to}</div>),
}));

describe('MarketRedirect', () => {
  const poolComptrollerAddress = '0xpoolComptrollerAddress';
  const vTokenAddress = '0xvTokenAddress';

  it('redirects to the market page when params are provided', () => {
    (useParams as Mock).mockReturnValue({
      poolComptrollerAddress,
      vTokenAddress,
    });

    const expectedPath = routes.market.path
      .replace(':poolComptrollerAddress', poolComptrollerAddress)
      .replace(':vTokenAddress', vTokenAddress);

    const { getByTestId } = renderComponent(<MarketRedirect />);

    expect(getByTestId('redirect').textContent).toBe(expectedPath);
    expect((Redirect as Mock).mock.calls[0][0]).toMatchObject({
      to: expectedPath,
    });
  });

  it('renders nothing when params are missing', () => {
    (useParams as Mock).mockReturnValue({});

    const { container, queryByTestId } = renderComponent(<MarketRedirect />);

    expect(container.textContent).toBe('');
    expect(queryByTestId('redirect')).toBeNull();
    expect(Redirect).not.toHaveBeenCalled();
  });
});
