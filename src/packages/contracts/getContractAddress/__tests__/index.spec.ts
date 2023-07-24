import getContractAddress from '..';
import { mainPoolComptroller } from '../../contractInfos';

describe('getContractAddress', () => {
  it('returns address when contract exists on chain', () => {
    const address = getContractAddress('mainPoolComptroller', {
      chainId: 56,
    });

    const contractAddresses = mainPoolComptroller.address!;
    expect(address).toBe(contractAddresses[56]);
  });

  it('returns address when contract does not exist on chain', () => {
    const address = getContractAddress('mainPoolComptroller', {
      chainId: 9999,
    });

    expect(address).toBe(undefined);
  });

  it('returns address when contract is generic', () => {
    const address = getContractAddress('isolatedPoolComptroller', {
      chainId: 56,
    });

    expect(address).toBe(undefined);
  });
});
