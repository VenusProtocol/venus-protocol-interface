import React from 'react';
import { createMemoryHistory } from 'history';
import { waitFor } from '@testing-library/react';

import { Market, MarketSnapshot } from 'types';
import { getMarkets, getMarketHistory } from 'clients/api';
import renderComponent from 'testUtils/renderComponent';
import MarketDetails from '.';

const fakeVTokenId = 'aave';

const fakeMarketSnapshot: MarketSnapshot = {
  id: '00a885e8-740e-433f-8a14-2323bc194c78',
  asset: '0x714db6c38a17883964b68a07d56ce331501d9eb6',
  blockNumber: 19376054,
  blockTimestamp: 1652766150,
  borrowApy: '0.156349768294577287',
  supplyApy: '0.00122371874104707',
  borrowVenusApy: '2.45',
  supplyVenusApy: '1.14',
  exchangeRate: '0.00000000020011429546',
  priceUSD: '10',
  totalBorrow: '1000',
  totalSupply: '10000',
  createdAt: '2022-05-17T05:44:01.000Z',
  updatedAt: '2022-05-17T06:00:06.000Z',
};

const fakeMarket: Market = {
  address: '0x714db6c38a17883964b68a07d56ce331501d9eb6',
  borrowApy: -0.15634976829457728,
  borrowCaps: '10000',
  borrowRatePerBlock: '149027019',
  borrowVenusApy: '1.23',
  borrowerCount: 6,
  borrowerDailyVenus: '12500000000000006400',
  cash: '10516052559851006074971',
  collateralFactor: '550000000000000000',
  exchangeRate: '2001142968171578063',
  lastCalculatedBlockNumber: 19381914,
  liquidity: '6000',
  name: 'Venus AAVE',
  reserveFactor: '10',
  supplierCount: 144,
  supplierDailyVenus: '12500000000000006400',
  supplyApy: '0.00122371874104707',
  supplyRatePerBlock: '1167307',
  supplyVenusApy: 'Infinity',
  symbol: 'vAAVE',
  tokenPrice: '40',
  totalBorrows: '83022130285987122204',
  totalBorrows2: '83.022130285987122204',
  totalBorrowsUsd: '4000',
  totalDistributed: '805',
  totalDistributed2: '805404721151106522488',
  totalReserves: '3000',
  totalSupply: '5296510473622606352590',
  totalSupply2: '52965104736226.0635259',
  totalSupplyUsd: '2000',
  underlyingAddress: '0x4b7268fc7c727b88c5fc127d41b491bfae63e144',
  underlyingDecimal: 18,
  underlyingName: 'Aave Token',
  underlyingPrice: '1.34',
  underlyingSymbol: 'AAVE',
  venusBorrowIndex: '40674306572014825507042162017412101362',
  venusSpeeds: '434027777777778',
  venusSupplyIndex: '5278885160128837031539536865063806472',
};

jest.mock('clients/api');

describe('pages/MarketDetails', () => {
  beforeEach(() => {
    (getMarketHistory as jest.Mock).mockImplementation(() => [fakeMarketSnapshot]);
    (getMarkets as jest.Mock).mockImplementation(() => [fakeMarket]);
  });

  it('renders without crashing', () => {
    const fakeHistory = createMemoryHistory();
    renderComponent(
      <MarketDetails
        history={fakeHistory}
        location="/"
        match={{
          params: {
            vTokenId: fakeVTokenId,
          },
          isExact: true,
          path: '/:vTokenId',
          url: '',
        }}
      />,
    );
  });

  it('fetches market details and displays them correctly', async () => {
    const fakeHistory = createMemoryHistory();
    const { getByTestId } = renderComponent(
      <MarketDetails
        history={fakeHistory}
        location="/"
        match={{
          params: {
            vTokenId: fakeVTokenId,
          },
          isExact: true,
          path: '/:vTokenId',
          url: '',
        }}
      />,
    );

    // Check supply info displays correctly
    await waitFor(() => expect(getByTestId('market-details-supply-info')).toMatchSnapshot());
    // Check borrow info displays correctly
    expect(getByTestId('market-details-borrow-info')).toMatchSnapshot();
    // Check interest rate model displays correctly
    expect(getByTestId('market-details-interest-rate-model')).toMatchSnapshot();
    // Check market info displays correctly
    expect(getByTestId('market-details-market-info')).toMatchSnapshot();
  });
});
