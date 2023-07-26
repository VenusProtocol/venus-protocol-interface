import { getContractAddress } from '..';
import fixedAddressContractInfos from '../../contractInfos/fixedAddressContractInfos';
import { ChainId } from '../../types';

describe('getContractAddress', () => {
  it('returns address when contract exists on chain', () => {
    const fakeChainId = 56;
    const address = getContractAddress('mainPoolComptroller', {
      chainId: fakeChainId,
    });

    expect(address).toBe(fixedAddressContractInfos.mainPoolComptroller.address[fakeChainId]);
  });

  it('returns undefined when contract does not exist for the chainId argument passed', () => {
    const fakeChainId = 1 as ChainId;
    const address = getContractAddress('mainPoolComptroller', {
      chainId: fakeChainId,
    });

    expect(address).toBe(undefined);
  });

  it('returns undefined when swap router contract does not exist for the comptrollerAddress argument passed', () => {
    const fakeChainId = 56;
    const address = getContractAddress('swapRouter', {
      chainId: fakeChainId,
      comptrollerAddress: '',
    });

    expect(address).toBe(undefined);
  });
});
