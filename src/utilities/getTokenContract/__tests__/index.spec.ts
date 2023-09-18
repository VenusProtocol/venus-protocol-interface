import { Signer } from 'ethers';
import { getGenericContract } from 'packages/contracts';

import { hay, vai, vrt, xvs } from '__mocks__/models/tokens';

import getTokenContract from '..';

vi.mock('packages/contracts');

describe('utilities/getTokenContract', () => {
  it('should use bep20 as default contract name', () => {
    const signerOrProvider: Signer = {} as Signer;

    getTokenContract({ token: hay, signerOrProvider });

    expect(getGenericContract).toHaveBeenCalledWith({
      name: 'bep20',
      address: hay.address,
      signerOrProvider,
    });
  });

  it.each([
    [xvs, 'xvs'],
    [vai, 'vai'],
    [vrt, 'vrt'],
  ])('should use %s contract for token %s', (token, expectedName) => {
    const signerOrProvider: Signer = {} as Signer;

    getTokenContract({ token, signerOrProvider });

    expect(getGenericContract).toHaveBeenCalledWith({
      name: expectedName,
      address: token.address,
      signerOrProvider,
    });
  });
});
