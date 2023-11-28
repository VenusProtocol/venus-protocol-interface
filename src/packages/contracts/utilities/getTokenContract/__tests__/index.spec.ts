import { Signer } from 'ethers';

import { hay, vai, vrt, xvs } from '__mocks__/models/tokens';

import {
  getBep20Contract,
  getVaiContract,
  getVrtContract,
  getXvsContract,
} from 'packages/contracts/generated/getters';

import { getTokenContract } from '..';

vi.mock('packages/contracts/generated/getters');

describe('getTokenContract', () => {
  it.each([
    [xvs, getXvsContract],
    [vai, getVaiContract],
    [vrt, getVrtContract],
  ])('should call the right method with the right arguments for %s token', (token, expectedFn) => {
    const signerOrProvider: Signer = {} as Signer;

    getTokenContract({ token, signerOrProvider });

    expect(expectedFn).toHaveBeenCalledWith({
      address: token.address,
      signerOrProvider,
    });
  });

  it('should call getBep20Contract with the right arguments for other BEP20 tokens', () => {
    const signerOrProvider: Signer = {} as Signer;

    getTokenContract({ token: hay, signerOrProvider });

    expect(getBep20Contract).toHaveBeenCalledWith({
      address: hay.address,
      signerOrProvider,
    });
  });
});
