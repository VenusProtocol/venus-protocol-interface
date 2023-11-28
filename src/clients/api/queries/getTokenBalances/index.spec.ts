import { BigNumber as BN } from 'ethers';
import Vi from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import fakeProvider from '__mocks__/models/provider';
import { bnb, busd, hay } from '__mocks__/models/tokens';

import { getTokenContract } from 'packages/contracts';

import getTokenBalances from '.';

vi.mock('packages/contracts/utilities/getTokenContract');

const tokens = [busd, hay];
const tokensWithBnB = [...tokens, bnb];

describe('api/queries/getTokenBalances', () => {
  beforeEach(() => {
    (getTokenContract as Vi.Mock).mockImplementation(() => ({
      balanceOf: async () => BN.from('10000'),
    }));
  });

  test('returns token balances in the right format on success', async () => {
    const res = await getTokenBalances({
      provider: fakeProvider,
      accountAddress: fakeAccountAddress,
      tokens,
    });

    expect(res).toMatchSnapshot();
  });

  test('returns token balances, including BNB, in the right format on success', async () => {
    const res = await getTokenBalances({
      provider: fakeProvider,
      accountAddress: fakeAccountAddress,
      tokens: tokensWithBnB,
    });

    expect(res).toMatchSnapshot();
  });
});
