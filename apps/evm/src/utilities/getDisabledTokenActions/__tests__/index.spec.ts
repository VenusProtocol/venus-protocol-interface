import type Vi from 'vitest';

import { xvs } from '__mocks__/models/tokens';

import { getDisabledTokenActions as getLocalDisabledTokenActions } from 'libs/tokens';
import { ChainId, type TokenAction } from 'types';

import { getDisabledTokenActions } from '..';

describe('getDisabledTokenActions', () => {
  it('returns the list of paused actions from the bitmask correctly', () => {
    const result = getDisabledTokenActions({
      bitmask: 165,
      chainId: ChainId.BSC_TESTNET,
      tokenAddresses: [],
    });

    expect(result).toMatchSnapshot();
  });

  it('returns the list of local disabled actions correctly', () => {
    const localDisabledTokenActions: TokenAction[] = ['swapAndSupply', 'repay'];

    (getLocalDisabledTokenActions as Vi.Mock).mockImplementation(() => localDisabledTokenActions);

    const result = getDisabledTokenActions({
      bitmask: 0,
      chainId: ChainId.BSC_TESTNET,
      tokenAddresses: [xvs.address],
    });

    expect(result).toEqual(localDisabledTokenActions);
  });

  it('returns the list of paused actions from bitmask and local disabled actions, merged correctly', () => {
    const localDisabledTokenActions: TokenAction[] = ['swapAndSupply', 'repay'];

    (getLocalDisabledTokenActions as Vi.Mock).mockImplementation(() => localDisabledTokenActions);

    const result = getDisabledTokenActions({
      bitmask: 165,
      chainId: ChainId.BSC_TESTNET,
      tokenAddresses: [xvs.address],
    });

    expect(result).toMatchSnapshot();
  });
});
