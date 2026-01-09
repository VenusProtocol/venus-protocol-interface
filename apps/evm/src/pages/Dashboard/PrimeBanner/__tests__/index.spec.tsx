import { fireEvent, screen } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import { useClaimPrimeToken } from 'clients/api';
import { routes } from 'constants/routing';
import { en } from 'libs/translations';
import { Route } from 'react-router';
import { renderComponent } from 'testUtils/render';
import { PrimeBanner } from '..';
import { store } from '../store';
import { testIds } from '../testIds';

const fakeBoostPercentage = new BigNumber(8.45);

describe('PrimeBanner', () => {
  it('displays nothing if user previously closed the modal and cannot become Prime yet', () => {
    store.getState().hidePrimePromotionalBanner();

    const { container } = renderComponent(
      <PrimeBanner boostPercentage={fakeBoostPercentage} canUserBecomePrime={false} />,
    );

    expect(container.textContent).toMatchSnapshot();
  });

  it('hide banners if user closes it', () => {
    const { container } = renderComponent(
      <PrimeBanner boostPercentage={fakeBoostPercentage} canUserBecomePrime={false} />,
    );

    fireEvent.click(screen.queryAllByTestId(testIds.closeButton)[1]);

    expect(store.getState().doNotShowPrimePromotionalBanner).toBe(true);
    expect(container.textContent).toMatchSnapshot();
  });

  it('displays correctly if user cannot become Prime yet', () => {
    const fakeVaultPageTitle = 'Fake vault page';
    const { container } = renderComponent(
      <PrimeBanner boostPercentage={fakeBoostPercentage} canUserBecomePrime={false} />,
      {
        otherRoutes: <Route path={routes.staking.path} element={<div>{fakeVaultPageTitle}</div>} />,
      },
    );

    expect(container.textContent).toMatchSnapshot();

    fireEvent.click(screen.queryAllByText(en.account.primeBanner.button.stakeXvs)[1]);

    expect(screen.getByText(fakeVaultPageTitle)).toBeInTheDocument();
  });

  it('displays correctly if user can become Prime', () => {
    const mockClaimPrimeToken = vi.fn();
    (useClaimPrimeToken as Mock).mockImplementation(() => ({
      mutateAsync: mockClaimPrimeToken,
    }));

    const { container } = renderComponent(
      <PrimeBanner boostPercentage={fakeBoostPercentage} canUserBecomePrime={true} />,
    );

    expect(container.textContent).toMatchSnapshot();

    fireEvent.click(screen.queryAllByText(en.account.primeBanner.button.becomePrime)[1]);

    expect(mockClaimPrimeToken).toHaveBeenCalledTimes(1);
  });
});
