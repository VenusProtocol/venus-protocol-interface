import { poolData } from '__mocks__/models/pools';
import { renderComponent } from 'testUtils/render';

import { PoolPositions, type PoolPositionsProps } from '..';
import TEST_IDS from '../testIds';

const baseProps: PoolPositionsProps = {
  pools: poolData,
};

describe('Pools', () => {
  it('renders without crashing', () => {
    renderComponent(<PoolPositions {...baseProps} />);
  });

  it('displays content correctly', () => {
    const legacyPool = baseProps.pools[0];
    const { getByTestId, getByText } = renderComponent(
      <PoolPositions {...baseProps} pools={[legacyPool]} />,
    );

    expect(getByText(legacyPool.name)).toBeTruthy();
    expect(getByTestId(TEST_IDS.tables).textContent).toMatchSnapshot();
  });
});
