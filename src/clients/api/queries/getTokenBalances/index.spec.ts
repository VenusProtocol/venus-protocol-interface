import { BigNumber as BN } from 'ethers';
import { getTokenContract } from 'utilities';
import Vi from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import fakeProvider from '__mocks__/models/provider';
import { SWAP_TOKENS } from 'constants/tokens';

import getTokenBalances from '.';

vi.mock('utilities/getTokenContract');

const tokens = [SWAP_TOKENS.busd, SWAP_TOKENS.cake];
const tokensWithBnB = [...tokens, SWAP_TOKENS.bnb];

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
