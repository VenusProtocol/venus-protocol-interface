import BigNumber from 'bignumber.js';

import { poolData } from '__mocks__/models/pools';
import { vaults } from '__mocks__/models/vaults';
import { renderComponent } from 'testUtils/render';

import Summary from '..';

describe('pages/Account/Summary', () => {
  it('renders without crashing', () => {
    renderComponent(<Summary pools={poolData} />);
  });

  it('displays stats correctly', () => {
    const { container } = renderComponent(<Summary pools={poolData} />);

    expect(container.textContent).toMatchSnapshot();
  });

  it('displays total vault stake when passing vaults prop and displayTotalVaultStake prop as true', () => {
    const { container } = renderComponent(
      <Summary
        pools={poolData}
        vaults={vaults}
        xvsPriceCents={new BigNumber(100)}
        vaiPriceCents={new BigNumber(328)}
        displayTotalVaultStake
      />,
    );

    expect(container.textContent).toMatchSnapshot();
  });

  it('displays health factor when passing displayHealthFactor prop as true', () => {
    const { container } = renderComponent(<Summary pools={poolData} displayHealthFactor />);

    expect(container.textContent).toMatchSnapshot();
  });
});
