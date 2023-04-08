import React from 'react';
import { isFeatureEnabled } from 'utilities';

import { poolData } from '__mocks__/models/pools';
import renderComponent from 'testUtils/renderComponent';
import originalIsFeatureEnabledMock from 'utilities/__mocks__/isFeatureEnabled';

import PoolBreakdown, { PoolBreakdownProps } from '.';
import SUMMARY_TEST_IDS from '../Summary/testIds';
import TEST_IDS from './testIds';

jest.mock('clients/api');

const baseProps: PoolBreakdownProps = {
  pool: poolData[0],
};

describe('pages/Account/PoolBreakdown', () => {
  it('renders without crashing', () => {
    renderComponent(<PoolBreakdown {...baseProps} />);
  });

  it('displays content correctly', () => {
    const { getByTestId } = renderComponent(<PoolBreakdown {...baseProps} />);

    expect(getByTestId(SUMMARY_TEST_IDS.container).textContent).toMatchSnapshot();
    expect(getByTestId(TEST_IDS.tables).textContent).toMatchSnapshot();
  });

  describe('Feature flag enabled: isolatedPools', () => {
    beforeEach(() => {
      (isFeatureEnabled as jest.Mock).mockImplementation(
        featureFlag => featureFlag === 'isolatedPools',
      );
    });

    afterEach(() => {
      (isFeatureEnabled as jest.Mock).mockRestore();
      (isFeatureEnabled as jest.Mock).mockImplementation(originalIsFeatureEnabledMock);
    });

    it('displays content correctly', () => {
      const { getByTestId } = renderComponent(<PoolBreakdown {...baseProps} />);

      expect(getByTestId(TEST_IDS.title).textContent).toMatchSnapshot();
      expect(getByTestId(SUMMARY_TEST_IDS.container).textContent).toMatchSnapshot();
      expect(getByTestId(TEST_IDS.tables).textContent).toMatchSnapshot();
    });
  });
});
