import { ChainId } from 'types';

import getUniqueContractAddress from '..';

describe('packages/contracts/config/getUniqueContractAddress', () => {
  it('returns contract address if it exists', () => {
    const result = getUniqueContractAddress({
      name: 'PoolLens',
      chainId: 97,
    });

    expect(typeof result).toBe('string');
    expect(result).toMatchInlineSnapshot('"0x6492dF28A9478230205c940A245Ffb114EaEb9d1"');
  });

  it('returns undefined if contract does not exist on passed chain', () => {
    const result = getUniqueContractAddress({
      name: 'PoolLens',
      chainId: 45 as ChainId,
    });

    expect(result).toBeUndefined();
  });
});
