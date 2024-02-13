import { ContractConfig } from 'libs/contracts/config';

import { isSwapRouterContractConfig } from '..';

describe('isSwapRouterContractConfig', () => {
  it('returns true when contract config is of type SwapRouterContractConfig', () => {
    const fakeContractConfig: ContractConfig = {
      name: 'SwapRouter',
      abi: [],
      address: {},
    };

    const result = isSwapRouterContractConfig(fakeContractConfig);
    expect(result).toBe(true);
  });

  it('returns false when contract config is not of type SwapRouterContractConfig', () => {
    const fakeContractConfig: ContractConfig = {
      name: 'NotSwapRouter',
      abi: [],
    };

    const result = isSwapRouterContractConfig(fakeContractConfig);
    expect(result).toBe(false);
  });
});
