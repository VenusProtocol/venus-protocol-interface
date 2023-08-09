import { Signer } from 'ethers';
import { getGenericContract } from 'packages/contracts';

import { TOKENS } from 'constants/tokens';

import getTokenContract from '..';

vi.mock('packages/contracts');

describe('utilities/getTokenContract', () => {
  it('should use bep20 as default contract name', () => {
    const signerOrProvider: Signer = {} as Signer;

    getTokenContract({ token: TOKENS.aave, signerOrProvider });

    expect(getGenericContract).toHaveBeenCalledWith({
      name: 'bep20',
      address: TOKENS.aave.address,
      signerOrProvider,
    });
  });

  it.each([
    [TOKENS.xvs, 'xvs'],
    [TOKENS.vai, 'vai'],
    [TOKENS.vrt, 'vrt'],
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
