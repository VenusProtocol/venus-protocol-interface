import { poolData } from '__mocks__/models/pools';
import { renderComponent } from 'testUtils/render';

import PoolsBreakdown, { PoolsBreakdownProps } from '.';
import TEST_IDS from './testIds';

const baseProps: PoolsBreakdownProps = {
  pools: poolData,
};

describe('PoolsBreakdown', () => {
  it('renders without crashing', () => {
    renderComponent(<PoolsBreakdown {...baseProps} />);
  });

  it('displays content correctly', () => {
    const legacyPool = baseProps.pools[0];
    const { getByTestId, getByText } = renderComponent(
      <PoolsBreakdown {...baseProps} pools={[legacyPool]} />,
    );

    expect(getByText(legacyPool.name)).toBeTruthy();
    expect(getByTestId(TEST_IDS.tables).textContent).toMatchSnapshot();
  });
});
