import React from 'react';

import { vaults } from '__mocks__/models/vaults';
import renderComponent from 'testUtils/renderComponent';

import VaultsBreakdown from '.';

vi.mock('clients/api');

describe('pages/Account/VaultsBreakdown', () => {
  it('renders without crashing', () => {
    renderComponent(<VaultsBreakdown vaults={vaults} />);
  });

  it('displays content correctly', () => {
    const { container } = renderComponent(<VaultsBreakdown vaults={vaults} />);

    expect(container.textContent).toMatchSnapshot();
  });
});
