import { vaults as fakeVaults } from '__mocks__/models/vaults';
import { renderComponent } from 'testUtils/render';
import { Vaults } from '..';

describe('Vaults', () => {
  it('displays content correctly', async () => {
    const { container } = renderComponent(<Vaults vaults={fakeVaults} />);

    expect(container.textContent).toMatchSnapshot();
  });
});
