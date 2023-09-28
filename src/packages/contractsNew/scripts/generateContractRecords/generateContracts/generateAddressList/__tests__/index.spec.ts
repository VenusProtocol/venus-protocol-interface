import fakeContractConfigs from 'packages/contractsNew/__testUtils__/fakeConfig';
import Vi from 'vitest';

import writeFile from 'utilities/writeFile';

import generateAddressList from '..';

vi.mock('utilities/writeFile');

describe('generateAddressList', () => {
  it('calls writeFile with the right arguments', async () => {
    await generateAddressList({
      outputFilePath: 'fake/output/director/path',
      contractConfigs: fakeContractConfigs,
    });

    expect(writeFile).toHaveBeenCalledTimes(1);
    expect((writeFile as Vi.Mock).mock.calls[0]).toMatchSnapshot();
  });
});
