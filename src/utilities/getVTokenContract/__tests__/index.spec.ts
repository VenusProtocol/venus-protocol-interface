import { Signer } from 'ethers';
import { getVBnbContract, getVTokenContract as getVTokenContractFn } from 'packages/contractsNew';

import { vBnb, vBusd } from '__mocks__/models/vTokens';

import getVTokenContract from '..';

vi.mock('packages/contractsNew');

describe('getVTokenContract', () => {
  it('should call getVBnbContract for vBNB token', () => {
    const signerOrProvider: Signer = {} as Signer;

    getVTokenContract({ vToken: vBnb, signerOrProvider });

    expect(getVBnbContract).toHaveBeenCalledWith({
      address: vBnb.address,
      signerOrProvider,
    });
  });

  it('should call getVTokenContract for other vBEP20 tokens', () => {
    const signerOrProvider: Signer = {} as Signer;

    getVTokenContract({ vToken: vBusd, signerOrProvider });

    expect(getVTokenContractFn).toHaveBeenCalledWith({
      address: vBusd.address,
      signerOrProvider,
    });
  });
});
