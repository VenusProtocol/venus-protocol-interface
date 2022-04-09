import { restService } from 'utilities/restService';
import getMarkets from './getMarkets';

jest.mock('utilities/restService');

const supportedMarket = {
  address: '0xd5c4c2e2facbeb59d0216d0595d63fcdc6f9a1a7',
  borrowApy: -2.0144969858718893,
  borrowCaps: '0',
  borrowRatePerBlock: '1902595671',
  borrowVenusApy: '0.000002129447247135',
  borrowerCount: 229,
  borrowerDailyVenus: '499999996800000000000',
  cash: '10001000096016507698102124',
  collateralFactor: '800000000000000000',
  exchangeRate: '212011549336411',
  lastCalculatedBlockNumber: 18251994,
  liquidity: '9999999996006906047.3323137876',
  name: 'Venus USDC',
  reserveFactor: '100000000000000000',
  supplierCount: 629,
  supplierDailyVenus: '499999996800000000000',
  supplyApy: '0.000001537885451792',
  supplyRatePerBlock: '1467',
  supplyVenusApy: '0.000000000001825',
  symbol: 'vUSDC',
  tokenPrice: '0.9999',
  totalBorrows: '8571156333013416587',
  totalBorrows2: '8571156333013.416587',
  totalBorrowsUsd: '8570299217380.1152453413',
  totalDistributed: '260494',
  totalDistributed2: '260494543020601880909016',
  totalReserves: '45860424364319617',
  totalSupply: '47171999131879185046048588013',
  totalSupply2: '471719991318791850460.48588013',
  totalSupplyUsd: '10000008520383416148.354763493825771157',
  underlyingAddress: '0x16227d60f7a0e586c66b005219dfc887d13c9531',
  underlyingDecimal: 6,
  underlyingName: 'USDC',
  underlyingPrice: '999900000000000000000000000000',
  underlyingSymbol: 'USDC',
  venusBorrowIndex: '2513615398720335958062590645849037196062852386675',
  venusSpeeds: '17361111000000000',
  venusSupplyIndex: '18116117080571365091301617497156799904494329',
};

describe('api/queries/getMarkets', () => {
  test('throws an error when request fails', async () => {
    const fakeErrorMessage = 'Fake error message';

    (restService as jest.Mock).mockImplementationOnce(async () => ({
      result: 'error',
      status: false,
      message: fakeErrorMessage,
    }));

    try {
      await getMarkets();

      throw new Error('getMarkets should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns supported markets', async () => {
    (restService as jest.Mock).mockImplementationOnce(async () => ({
      status: 200,
      data: { data: { markets: [supportedMarket] } },
    }));

    const response = await getMarkets();

    expect(response).toHaveLength(1);
  });

  test('filters unsupported markets', async () => {
    const unsupportedMarket = { ...supportedMarket, underlyingSymbol: 'NOPE' };
    (restService as jest.Mock).mockImplementationOnce(async () => ({
      status: 200,
      data: { data: { markets: [unsupportedMarket] } },
    }));

    const response = await getMarkets();

    expect(response).toHaveLength(0);
  });
});
