import type { Mock } from 'vitest';

import { vaults as fakeVaults } from '__mocks__/models/vaults';
import { renderComponent } from 'testUtils/render';

import { useGetVaults } from 'clients/api';

import Staking from '..';

describe('StakingUi', () => {
  beforeEach(() => {
    (useGetVaults as Mock).mockImplementation(() => ({
      data: fakeVaults,
      isLoading: false,
    }));
  });

  it('renders without crashing', async () => {
    renderComponent(<Staking />);
  });

  it('renders vaults correctly', async () => {
    const { container } = renderComponent(<Staking />);

    expect(container.textContent).toMatchSnapshot();
  });
});
