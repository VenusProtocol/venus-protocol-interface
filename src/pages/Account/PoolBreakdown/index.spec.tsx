import React from 'react';
import { isFeatureEnabled } from 'utilities';

import { poolData } from '__mocks__/models/pools';
import renderComponent from 'testUtils/renderComponent';
import originalIsFeatureEnabledMock from 'utilities/__mocks__/isFeatureEnabled';

import PoolBreakdown, { PoolBreakdownProps } from '.';
import SUMMARY_TEST_IDS from '../Summary/testIds';
import TEST_IDS from './testIds';

vi.mock('clients/api');

const baseProps: PoolBreakdownProps = {
  pool: poolData[0],
};

describe('pages/Account/PoolBreakdown', () => {
  it('renders without crashing', () => {
    renderComponent(<PoolBreakdown {...baseProps} />);
  });

  it('displays content correctly', () => {
    const { getByTestId, getByText } = renderComponent(<PoolBreakdown {...baseProps} />);

    expect(getByText(baseProps.pool.name)).toBeTruthy();
    expect(getByTestId(TEST_IDS.tables).textContent).toMatchSnapshot();
  });

  describe('Feature flag enabled: isolatedPools', () => {
    beforeEach(() => {
      (isFeatureEnabled as vi.Mock).mockImplementation(
        featureFlag => featureFlag === 'isolatedPools',
      );
    });

    afterEach(() => {
      (isFeatureEnabled as vi.Mock).mockRestore();
      (isFeatureEnabled as vi.Mock).mockImplementation(originalIsFeatureEnabledMock);
    });

    it('displays content correctly', () => {
      const { getByTestId, getByText } = renderComponent(<PoolBreakdown {...baseProps} />);

      expect(getByText(baseProps.pool.name)).toBeTruthy();
      expect(getByTestId(SUMMARY_TEST_IDS.container).textContent).toMatchSnapshot();
      expect(getByTestId(TEST_IDS.tables).textContent).toMatchSnapshot();
    });
  });
});
