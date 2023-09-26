import fakeContractConfigs from 'packages/contractsNew/__testUtils__/fakeConfig';
import Vi from 'vitest';

import { writeFile } from 'utilities/writeFile';

import generateAbis from '..';

vi.mock('utilities/writeFile');

describe('generateAbis', () => {
  it('calls writeFile with the right arguments', async () => {
    await generateAbis({
      outputDirectoryPath: 'fake/output/director/path',
      contractConfigs: fakeContractConfigs,
    });

    expect(writeFile).toHaveBeenCalledTimes(fakeContractConfigs.length);

    fakeContractConfigs.forEach((_fakeContractConfig, index) =>
      expect((writeFile as Vi.Mock).mock.calls[index]).toMatchSnapshot(),
    );
  });
});
