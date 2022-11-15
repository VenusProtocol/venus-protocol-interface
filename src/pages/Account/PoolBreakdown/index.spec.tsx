import React from 'react';

import { poolData } from '__mocks__/models/pools';
import renderComponent from 'testUtils/renderComponent';

import PoolBreakdown, { PoolBreakdownProps } from '.';
import TEST_IDS from './testIds';

jest.mock('clients/api');

const baseProps: PoolBreakdownProps = {
  pool: poolData[0],
  includeXvs: true,
};

describe('pages/Account/PoolBreakdown', () => {
  it('renders without crashing', () => {
    renderComponent(<PoolBreakdown {...baseProps} />);
  });

  it.each([true, false])(
    'displays stats and tables correctly when includeXvs is %s',
    includeXvs => {
      const { getByTestId } = renderComponent(
        <PoolBreakdown {...baseProps} includeXvs={includeXvs} />,
      );

      expect(getByTestId(TEST_IDS.stats).textContent).toMatchSnapshot();
      expect(getByTestId(TEST_IDS.tables).textContent).toMatchSnapshot();
    },
  );
});
