import { ContractConfig } from 'packages/contractsNew/config';
import Vi from 'vitest';

import writeFile from 'utilities/writeFile';

import generateGetters from '..';

vi.mock('utilities/writeFile');

const fakeContractConfigs: ContractConfig[] = [
  {
    name: 'PoolLens',
    abi: [],
    address: {},
  },
  {
    name: 'IsolatedPoolComptroller',
    abi: [],
  },
  {
    name: 'SwapRouter',
    abi: [],
    address: {},
  },
];

describe('generateGetters', () => {
  it('calls writeFile with the right arguments', () => {
    generateGetters({
      outputDirectoryPath: 'fake/output/director/path',
      contractConfigs: fakeContractConfigs,
    });

    expect(writeFile).toHaveBeenCalledTimes(fakeContractConfigs.length);

    fakeContractConfigs.forEach((_fakeContractConfig, index) =>
      expect((writeFile as Vi.Mock).mock.calls[index]).toMatchSnapshot(),
    );
  });
});
