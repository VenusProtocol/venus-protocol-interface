import BigNumber from 'bignumber.js';
import React from 'react';

import { assetData } from '__mocks__/models/asset';
import renderComponent from 'testUtils/renderComponent';

import MarketBreakdown, { MarketBreakdownProps } from '.';
import TEST_IDS from './testIds';

jest.mock('clients/api');

const baseProps: MarketBreakdownProps = {
  assets: assetData,
  includeXvs: true,
  marketName: 'Fake market name',
  riskLevel: 'VERY_HIGH',
  dailyXvsDistributionInterestsCents: new BigNumber(19),
};

describe('pages/Account/MarketBreakdown', () => {
  it('renders without crashing', () => {
    renderComponent(<MarketBreakdown {...baseProps} />);
  });

  it.each([true, false])(
    'displays stats and tables correctly when isXvsEnabled is %s',
    isXvsEnabled => {
      const { getByTestId } = renderComponent(
        <MarketBreakdown {...baseProps} includeXvs={includeXvs} />,
      );

      expect(getByTestId(TEST_IDS.stats).textContent).toMatchSnapshot();
      expect(getByTestId(TEST_IDS.tables).textContent).toMatchSnapshot();
    },
  );
});
