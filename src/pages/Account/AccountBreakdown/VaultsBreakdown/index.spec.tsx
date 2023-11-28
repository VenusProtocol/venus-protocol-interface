import { vaults } from '__mocks__/models/vaults';
import { renderComponent } from 'testUtils/render';

import VaultsBreakdown from '.';

describe('pages/Account/VaultsBreakdown', () => {
  it('renders without crashing', () => {
    renderComponent(<VaultsBreakdown vaults={vaults} />);
  });

  it('displays content correctly', () => {
    const { container } = renderComponent(<VaultsBreakdown vaults={vaults} />);

    expect(container.textContent).toMatchSnapshot();
  });
});
