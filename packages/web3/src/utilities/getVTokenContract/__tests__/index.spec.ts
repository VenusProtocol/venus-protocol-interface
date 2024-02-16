import { Signer } from 'ethers';
import { getVBep20Contract, getVBnbContract } from 'generated/contracts';

import { vBnb, vBusd } from '__testUtils__/fakeVTokens';

import { getVTokenContract } from '..';

vi.mock('generated/contracts');

describe('getVTokenContract', () => {
  it('should call getVBnbContract for vBNB token', () => {
    const signerOrProvider: Signer = {} as Signer;

    getVTokenContract({ vToken: vBnb, signerOrProvider });

    expect(getVBnbContract).toHaveBeenCalledWith({
      address: vBnb.address,
      signerOrProvider,
    });
  });

  it('should call getVBEP20Contract for other vBEP20 tokens', () => {
    const signerOrProvider: Signer = {} as Signer;

    getVTokenContract({ vToken: vBusd, signerOrProvider });

    expect(getVBep20Contract).toHaveBeenCalledWith({
      address: vBusd.address,
      signerOrProvider,
    });
  });
});
