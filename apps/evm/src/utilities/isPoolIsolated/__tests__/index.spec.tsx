import { ChainId } from '@venusprotocol/chains';
import type Vi from 'vitest';

import areAddressesEqual from 'utilities/areAddressesEqual';
import { isPoolIsolated } from '..';

vi.mock('utilities/areAddressesEqual', () => ({
  default: vi.fn(),
}));

describe('isPoolIsolated', () => {
  it('returns true for chainId not BSC_MAINNET or BSC_TESTNET regardless of address', () => {
    (areAddressesEqual as Vi.Mock).mockReturnValueOnce(true);
    const result = isPoolIsolated({
      chainId: ChainId.ARBITRUM_ONE,
      comptrollerAddress: '0xAnyAddress',
    });
    expect(result).toBe(true);
  });

  it('returns false for BSC_MAINNET with matching address', () => {
    (areAddressesEqual as Vi.Mock).mockReturnValueOnce(true);
    const result = isPoolIsolated({
      chainId: ChainId.BSC_MAINNET,
      comptrollerAddress: '0xCoreComptrollerMainnet',
    });
    expect(result).toBe(false);
  });

  it('returns false for BSC_TESTNET with matching address', () => {
    (areAddressesEqual as Vi.Mock).mockReturnValueOnce(true);
    const result = isPoolIsolated({
      chainId: ChainId.BSC_TESTNET,
      comptrollerAddress: '0xCoreComptrollerMainnet',
    });
    expect(result).toBe(false);
  });

  it('returns true for BSC_MAINNET with non-matching address', () => {
    (areAddressesEqual as Vi.Mock).mockReturnValueOnce(false);
    const result = isPoolIsolated({
      chainId: ChainId.BSC_MAINNET,
      comptrollerAddress: '0xDifferentAddress',
    });
    expect(result).toBe(true);
  });

  it('returns true for BSC_TESTNET with non-matching address', () => {
    (areAddressesEqual as Vi.Mock).mockReturnValueOnce(false);
    const result = isPoolIsolated({
      chainId: ChainId.BSC_TESTNET,
      comptrollerAddress: '0xDifferentAddress',
    });
    expect(result).toBe(true);
  });
});
