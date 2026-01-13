import { ChainId, bnbChainMainnetFermiUpgradeTimestampMs } from '@venusprotocol/chains';
import { addresses } from 'libs/contracts/generated/addresses';

import { getContractAddress } from '..';

describe('getContractAddress', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the unique contract address for the chain', () => {
    const result = getContractAddress({
      name: 'PoolRegistry',
      chainId: ChainId.BSC_MAINNET,
    });

    expect(result).toBe(addresses.uniques.PoolRegistry[ChainId.BSC_MAINNET]);
  });

  it('returns the per-pool contract address using a case-insensitive pool address', () => {
    const result = getContractAddress({
      name: 'SwapRouter',
      chainId: ChainId.BSC_MAINNET,
      poolComptrollerContractAddress: '0xfD36E2c2a6789Db23113685031d7F16329158384',
    });

    expect(result).toBe(
      addresses.uniquesPerPool.SwapRouter[ChainId.BSC_MAINNET]![
        '0xfd36e2c2a6789db23113685031d7f16329158384'
      ],
    );
  });

  it('returns undefined when the per-pool mapping does not exist for the chain', () => {
    const result = getContractAddress({
      name: 'SwapRouter',
      chainId: ChainId.ARBITRUM_SEPOLIA,
      poolComptrollerContractAddress: '0xfD36E2c2a6789Db23113685031d7F16329158384',
    });

    expect(result).toBeUndefined();
  });

  it('returns the temporary VenusLens address after the Fermi upgrade timestamp', () => {
    vi.useFakeTimers().setSystemTime(new Date(bnbChainMainnetFermiUpgradeTimestampMs + 1000));

    const result = getContractAddress({
      name: 'VenusLens',
      chainId: ChainId.BSC_MAINNET,
    });

    expect(result).toBe('0x969a45F1bb5Ba4037CB44664135862D0c2226F89');
  });

  it('returns the standard VenusLens address before the Fermi upgrade timestamp', () => {
    vi.useFakeTimers().setSystemTime(new Date(bnbChainMainnetFermiUpgradeTimestampMs - 1000));

    const result = getContractAddress({
      name: 'VenusLens',
      chainId: ChainId.BSC_MAINNET,
    });

    expect(result).toBe(addresses.uniques.VenusLens[ChainId.BSC_MAINNET]);
  });
});
