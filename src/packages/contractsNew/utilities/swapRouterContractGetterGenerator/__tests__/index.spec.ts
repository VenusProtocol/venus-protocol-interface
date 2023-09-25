import { Contract, type ContractInterface, providers } from 'ethers';
import getSwapRouterContractAddress from 'packages/contractsNew/getSwapRouterContractAddress';
import { ChainId } from 'types';
import Vi from 'vitest';

import fakeComptrollerContractAddress, {
  altAddress as fakeSwapRouterContractAddress,
} from '__mocks__/models/address';

import swapRouterContractGetterGenerator from '..';

vi.mock('packages/contractsNew/getSwapRouterContractAddress');

const fakeProvider = new providers.JsonRpcProvider();

describe('swapRouterContractGetterGenerator', () => {
  it('returns Contract instance when contract exists', () => {
    (getSwapRouterContractAddress as Vi.Mock).mockImplementation(
      () => fakeSwapRouterContractAddress,
    );

    const fakeAbi: ContractInterface = [];

    const getContract = swapRouterContractGetterGenerator({
      abi: fakeAbi,
    });

    const contract = getContract({
      chainId: ChainId.BSC_TESTNET,
      comptrollerAddress: fakeComptrollerContractAddress,
      signerOrProvider: fakeProvider,
    });

    expect(contract).toBeInstanceOf(Contract);
    expect(contract?.address).toBe(fakeSwapRouterContractAddress);
    expect(contract?.provider).toBe(fakeProvider);
  });

  it('returns undefined when contract does not exist', () => {
    (getSwapRouterContractAddress as Vi.Mock).mockImplementation(() => undefined);

    const fakeAbi: ContractInterface = [];

    const getContract = swapRouterContractGetterGenerator({
      abi: fakeAbi,
    });

    const contract = getContract({
      chainId: ChainId.BSC_TESTNET,
      comptrollerAddress: fakeComptrollerContractAddress,
      signerOrProvider: fakeProvider,
    });

    expect(contract).toBeUndefined();
  });
});
