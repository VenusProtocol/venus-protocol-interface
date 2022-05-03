import React from 'react';
import BigNumber from 'bignumber.js';
import { within } from '@testing-library/dom';
import { assetData } from '__mocks__/models/asset';
import renderComponent from 'testUtils/renderComponent';
import { useUserMarketInfo } from 'clients/api';
import en from 'translation/translations/en.json';
import Dashboard from '.';

jest.mock('clients/api');

describe('pages/Dashboard', () => {
  beforeEach(() => {
    (useUserMarketInfo as jest.Mock).mockImplementation(() => ({
      assets: assetData,
      userTotalBorrowLimit: new BigNumber('111'),
      userTotalBorrowBalance: new BigNumber('91'),
      userTotalSupplyBalance: new BigNumber('910'),
    }));
  });

  it('filters and displays supplied tokens in supplied section', async () => {
    const { getAllByLabelText } = renderComponent(<Dashboard />);
    // React Testing Library doesn't ignore elements hidden through css
    // ("display: none"), so we get all the matching elements and use the first
    // one
    const suppliedTable = getAllByLabelText(en.markets.suppliedTableTitle)[0];
    expect(suppliedTable).toBeTruthy();
    // Supplied coins in mock data include usdc and sxp
    within(suppliedTable as HTMLTableSectionElement).getByText('SXP');
    within(suppliedTable as HTMLTableSectionElement).getByText('USDC');
    expect(within(suppliedTable as HTMLTableSectionElement).queryByText('BUSD')).toBeNull();
    expect(within(suppliedTable as HTMLTableSectionElement).queryByText('USDT')).toBeNull();
  });

  it('filters and displays non supplied tokens in Supply Market section', async () => {
    const { getAllByLabelText } = renderComponent(<Dashboard />);
    // React Testing Library doesn't ignore elements hidden through css
    // ("display: none"), so we get all the matching elements and use the first
    // one
    const nonSuppliedTable = getAllByLabelText(en.markets.supplyMarketTableTitle)[0];
    // Supplied coins in mock data include busd and usdt
    within(nonSuppliedTable as HTMLTableSectionElement).getByText('BUSD');
    within(nonSuppliedTable as HTMLTableSectionElement).getByText('USDT');
    expect(within(nonSuppliedTable as HTMLTableSectionElement).queryByText('SXP')).toBeNull();
    expect(within(nonSuppliedTable as HTMLTableSectionElement).queryByText('USDC')).toBeNull();
  });
});
