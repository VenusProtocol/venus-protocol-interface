import addresses from 'packages/contracts/generated/infos/addresses';
import { UniqueContractName } from 'packages/contracts/generated/infos/types';
import { ChainId } from 'types';

import { getUniqueContractAddress } from '..';

const existingContractName = Object.keys(addresses)[0] as UniqueContractName;

describe('getUniqueContractAddress', () => {
  it('returns contract address if it exists', () => {
    const existingContractChainId = +Object.keys(addresses[existingContractName])[0] as ChainId;

    const result = getUniqueContractAddress({
      name: existingContractName,
      chainId: existingContractChainId,
    });

    expect(typeof result).toBe('string');
  });

  it('returns undefined if contract does not exist on passed chain', () => {
    const result = getUniqueContractAddress({
      name: existingContractName,
      chainId: 9999 as ChainId,
    });

    expect(result).toBeUndefined();
  });
});
