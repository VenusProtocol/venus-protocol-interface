import { Contract, type ContractInterface, providers } from 'ethers';

import genericContractGetterGenerator from '..';

const fakeProvider = new providers.JsonRpcProvider();

describe('packages/contracts/utilities/genericContractGetterGenerator', () => {
  it('returns Contract instance', () => {
    const fakeAddress = 'fake-address';
    const fakeAbi: ContractInterface = [];

    const getContract = genericContractGetterGenerator({
      abi: fakeAbi,
    });

    const contract = getContract({
      address: fakeAddress,
      signerOrProvider: fakeProvider,
    });

    expect(contract).toBeInstanceOf(Contract);
    expect(contract?.address).toBe(fakeAddress);
    expect(contract?.provider).toBe(fakeProvider);
  });
});
