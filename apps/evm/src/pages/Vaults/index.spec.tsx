import type { Mock } from 'vitest';

import { vaults as fakeVaults } from '__mocks__/models/vaults';
import { renderComponent } from 'testUtils/render';

import { useGetVaults } from 'clients/api';

import Vault from '.';

describe('pages/Vault', () => {
  beforeEach(() => {
    (useGetVaults as Mock).mockImplementation(() => ({
      data: fakeVaults,
      isLoading: false,
    }));
  });

  it('renders without crashing', async () => {
    renderComponent(<Vault />);
  });

  it('renders vaults correctly', async () => {
    const { container } = renderComponent(<Vault />);

    expect(container.textContent).toMatchSnapshot();
  });
});
