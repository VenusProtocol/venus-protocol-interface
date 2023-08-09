import { Signer } from 'ethers';
import { getGenericContract } from 'packages/contracts';

import { TESTNET_VBEP_TOKENS } from 'constants/tokens';

import getVTokenContract from '..';

vi.mock('packages/contracts');

describe('utilities/getVTokenContract', () => {
  it('should use vToken as default contract name', () => {
    const signerOrProvider: Signer = {} as Signer;

    const vToken = TESTNET_VBEP_TOKENS['0x08e0a5575de71037ae36abfafb516595fe68e5e4'];
    getVTokenContract({ vToken, signerOrProvider });

    expect(getGenericContract).toHaveBeenCalledWith({
      name: 'vToken',
      address: vToken.address,
      signerOrProvider,
    });
  });

  it('should use vBnb contract for vBNB token', () => {
    const signerOrProvider: Signer = {} as Signer;

    const vBnb = TESTNET_VBEP_TOKENS['0x2e7222e51c0f6e98610a1543aa3836e092cde62c'];
    getVTokenContract({ vToken: vBnb, signerOrProvider });

    expect(getGenericContract).toHaveBeenCalledWith({
      name: 'vBnb',
      address: vBnb.address,
      signerOrProvider,
    });
  });
});
