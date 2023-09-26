import { Signer } from 'ethers';
import { getGenericContract } from 'packages/contracts';

import { vBnb, vBusd } from '__mocks__/models/vTokens';

import { getVTokenContract } from '..';

vi.mock('packages/contracts');

describe('getVTokenContract', () => {
  it('should use vToken as default contract name', () => {
    const signerOrProvider: Signer = {} as Signer;

    getVTokenContract({ vToken: vBusd, signerOrProvider });

    expect(getGenericContract).toHaveBeenCalledWith({
      name: 'vToken',
      address: vBusd.address,
      signerOrProvider,
    });
  });

  it('should use vBnb contract for vBNB token', () => {
    const signerOrProvider: Signer = {} as Signer;

    getVTokenContract({ vToken: vBnb, signerOrProvider });

    expect(getGenericContract).toHaveBeenCalledWith({
      name: 'vBnb',
      address: vBnb.address,
      signerOrProvider,
    });
  });
});
