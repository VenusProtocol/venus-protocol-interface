import { waitFor } from '@testing-library/react';

import fakeAccountAddress from '__mocks__/models/address';
import { renderComponent } from 'testUtils/render';
import { Dashboard } from '..';

describe('Dashboard', () => {
  it('displays content correctly', async () => {
    const { container } = renderComponent(<Dashboard />, {
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() => expect(container.textContent).not.toBeFalsy());

    expect(container.textContent).toMatchSnapshot();
  });
});
