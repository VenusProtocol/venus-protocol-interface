import { Contract, type ContractInterface, providers } from 'ethers';
import { getUniqueContractAddress } from 'packages/contractsNew/getUniqueContractAddress';
import { ChainId } from 'types';
import Vi from 'vitest';

import fakeSwapRouterContractAddress from '__mocks__/models/address';

import { uniqueContractGetterGenerator } from '..';

vi.mock('packages/contractsNew/getUniqueContractAddress');

const fakeProvider = new providers.JsonRpcProvider();

describe('uniqueContractGetterGenerator', () => {
  it('returns Contract instance when contract exists', () => {
    (getUniqueContractAddress as Vi.Mock).mockImplementation(() => fakeSwapRouterContractAddress);

    const fakeAbi: ContractInterface = [];

    const getContract = uniqueContractGetterGenerator({
      abi: fakeAbi,
      name: 'PoolLens',
    });

    const contract = getContract({
      chainId: ChainId.BSC_TESTNET,
      signerOrProvider: fakeProvider,
    });

    expect(contract).toBeInstanceOf(Contract);
    expect(contract?.address).toBe(fakeSwapRouterContractAddress);
    expect(contract?.provider).toBe(fakeProvider);
  });

  it('returns undefined when contract does not exist', () => {
    (getUniqueContractAddress as Vi.Mock).mockImplementation(() => undefined);

    const fakeAbi: ContractInterface = [];

    const getContract = uniqueContractGetterGenerator({
      abi: fakeAbi,
      name: 'PoolLens',
    });

    const contract = getContract({
      chainId: ChainId.BSC_TESTNET,
      signerOrProvider: fakeProvider,
    });

    expect(contract).toBeUndefined();
  });
});
