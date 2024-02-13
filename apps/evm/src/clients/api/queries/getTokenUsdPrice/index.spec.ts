import { BigNumber } from 'ethers';
import { ResilientOracle } from 'libs/contracts';

import { bnb } from '__mocks__/models/tokens';

import getTokenUsdPrice from '.';

describe('api/queries/getTokenUsdPrice', () => {
  test('returns token price in the right format on success', async () => {
    const fakePriceMantissa = BigNumber.from('7235878500000000000');
    const getPriceMock = vi.fn(async () => fakePriceMantissa);

    const fakeContract = {
      getPrice: getPriceMock,
    } as unknown as ResilientOracle;

    const res = await getTokenUsdPrice({
      resilientOracleContract: fakeContract,
      token: bnb,
    });

    expect(res).toMatchSnapshot();
  });
});
