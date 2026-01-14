import { ChainId } from '@venusprotocol/chains';
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
});
