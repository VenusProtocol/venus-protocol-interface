import { ChainId } from 'types';
import Vi from 'vitest';

import fakeSwapRouterContractAddress, {
  altAddress as fakeComptrollerContractAddress,
} from '__mocks__/models/address';
import { getSwapRouterContractAddress } from 'packages/contractsNew/utilities/getSwapRouterContractAddress';

import { swapRouterContractAddressGetterGenerator } from '..';

vi.mock('packages/contractsNew/utilities/getSwapRouterContractAddress');

describe('swapRouterContractAddressGetterGenerator', () => {
  it('returns Contract instance when contract exists', () => {
    (getSwapRouterContractAddress as Vi.Mock).mockImplementation(
      () => fakeSwapRouterContractAddress,
    );

    const getContractAddress = swapRouterContractAddressGetterGenerator();

    const contractAddress = getContractAddress({
      chainId: ChainId.BSC_TESTNET,
      comptrollerContractAddress: fakeComptrollerContractAddress,
    });

    expect(contractAddress).toBe(fakeSwapRouterContractAddress);
  });

  it('returns undefined when contract does not exist', () => {
    (getSwapRouterContractAddress as Vi.Mock).mockImplementation(() => undefined);

    const getContractAddress = swapRouterContractAddressGetterGenerator();

    const contract = getContractAddress({
      chainId: ChainId.BSC_TESTNET,
      comptrollerContractAddress: fakeComptrollerContractAddress,
    });

    expect(contract).toBeUndefined();
  });
});
