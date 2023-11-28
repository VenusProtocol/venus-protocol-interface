import { Signer } from 'ethers';

import { vBnb, vBusd } from '__mocks__/models/vTokens';

import { getVBep20Contract, getVBnbContract } from 'packages/contracts/generated/getters';

import { getVTokenContract } from '..';

vi.mock('packages/contracts/generated/getters');

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
