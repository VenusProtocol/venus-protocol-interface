import type { ContractConfig } from 'libs/contracts/config';

import { isUniquePerPoolContractConfig } from '..';

describe('isUniquePerPoolContractConfig', () => {
  it('returns true when contract config is of type SwapRouterContractConfig', () => {
    const fakeContractConfig: ContractConfig = {
      name: 'SwapRouter',
      abi: [],
      address: {},
    };

    const result = isUniquePerPoolContractConfig(fakeContractConfig);
    expect(result).toBe(true);
  });

  it('returns true when contract config is of type NativeTokenGatewayContractConfig', () => {
    const fakeContractConfig: ContractConfig = {
      name: 'NativeTokenGateway',
      abi: [],
      address: {},
    };

    const result = isUniquePerPoolContractConfig(fakeContractConfig);
    expect(result).toBe(true);
  });

  it('returns false when checking a contract that is not unique per pool', () => {
    const fakeContractConfig: ContractConfig = {
      name: 'NotUniquePerPool',
      abi: [],
    };

    const result = isUniquePerPoolContractConfig(fakeContractConfig);
    expect(result).toBe(false);
  });
});
