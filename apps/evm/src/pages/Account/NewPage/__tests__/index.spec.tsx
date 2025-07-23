import { waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import { useGetUserVaiBorrowBalance } from 'clients/api';
import { renderComponent } from 'testUtils/render';
import type { Mock } from 'vitest';
import { NewPage } from '..';

describe('Account', () => {
  beforeEach(() => {
    (useGetUserVaiBorrowBalance as Mock).mockImplementation(() => ({
      data: {
        userVaiBorrowBalanceMantissa: new BigNumber('1000000000000000000000'),
      },
      isLoading: false,
    }));
  });

  it('displays content correctly', async () => {
    const { container } = renderComponent(<NewPage />);

    await waitFor(() => expect(container.textContent).not.toBeFalsy());

    expect(container.textContent).toMatchSnapshot();
  });
});
