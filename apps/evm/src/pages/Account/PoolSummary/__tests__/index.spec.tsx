import BigNumber from 'bignumber.js';

import { poolData } from '__mocks__/models/pools';
import { vaults } from '__mocks__/models/vaults';
import { renderComponent } from 'testUtils/render';

import { PoolSummary } from '..';

describe('PoolSummary', () => {
  it('renders without crashing', () => {
    renderComponent(<PoolSummary pools={poolData} />);
  });

  it('displays stats correctly', () => {
    const { container } = renderComponent(<PoolSummary pools={poolData} />);

    expect(container.textContent).toMatchSnapshot();
  });

  it('displays total vault stake when passing vaults prop and displayTotalVaultStake prop as true', () => {
    const { container } = renderComponent(
      <PoolSummary
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
    const { container } = renderComponent(<PoolSummary pools={poolData} displayHealthFactor />);

    expect(container.textContent).toMatchSnapshot();
  });
});
