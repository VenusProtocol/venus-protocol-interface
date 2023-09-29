import addresses from 'packages/contractsNew/generated/infos/addresses';
import { ChainId } from 'types';

import { getSwapRouterContractAddress } from '..';

const existingSwapRouterChainId = +Object.keys(addresses.SwapRouter)[0] as ChainId;
const existingSwapRouterComptrollerAddress = Object.keys(
  addresses.SwapRouter[existingSwapRouterChainId],
)[0];

describe('getSwapRouterContractAddress', () => {
  it('returns contract address if it exists', () => {
    const result = getSwapRouterContractAddress({
      comptrollerContractAddress: existingSwapRouterComptrollerAddress,
      chainId: existingSwapRouterChainId,
    });

    expect(typeof result).toBe('string');
  });

  it('returns undefined if contract does not exist on passed chain', () => {
    const result = getSwapRouterContractAddress({
      comptrollerContractAddress: existingSwapRouterComptrollerAddress,
      chainId: 9999 as ChainId,
    });

    expect(result).toBeUndefined();
  });

  it('returns undefined if contract does not exist for passed Comptroller contract address', () => {
    const result = getSwapRouterContractAddress({
      comptrollerContractAddress: 'fake-comptroller-address',
      chainId: existingSwapRouterChainId,
    });

    expect(result).toBeUndefined();
  });
});
