import { ChainId } from 'types';
import Vi from 'vitest';

import fakeSwapRouterContractAddress from '__mocks__/models/address';
import { getUniqueContractAddress } from 'packages/contracts/utilities/getUniqueContractAddress';

import { uniqueContractAddressGetterGenerator } from '..';

vi.mock('packages/contracts/utilities/getUniqueContractAddress');

describe('uniqueContractAddressGetterGenerator', () => {
  it('returns Contract instance when contract exists', () => {
    (getUniqueContractAddress as Vi.Mock).mockImplementation(() => fakeSwapRouterContractAddress);

    const getContractAddress = uniqueContractAddressGetterGenerator({
      name: 'PoolLens',
    });

    const contractAddress = getContractAddress({
      chainId: ChainId.BSC_TESTNET,
    });

    expect(contractAddress).toBe(fakeSwapRouterContractAddress);
  });

  it('returns undefined when contract does not exist', () => {
    (getUniqueContractAddress as Vi.Mock).mockImplementation(() => undefined);

    const getContractAddress = uniqueContractAddressGetterGenerator({
      name: 'PoolLens',
    });

    const contract = getContractAddress({
      chainId: ChainId.BSC_TESTNET,
    });

    expect(contract).toBeUndefined();
  });
});
