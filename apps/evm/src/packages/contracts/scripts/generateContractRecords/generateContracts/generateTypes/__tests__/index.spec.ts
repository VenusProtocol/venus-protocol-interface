import { glob, runTypeChain } from 'typechain';
import Vi from 'vitest';

import { fakeContractConfigs } from 'packages/contracts/__testUtils__/fakeConfig';
import cwd from 'utilities/cwd';
import writeFile from 'utilities/writeFile';

import { generateTypes } from '..';

vi.mock('typechain');
vi.mock('utilities/writeFile');
vi.mock('utilities/cwd');

describe('generateTypes', () => {
  beforeEach(() => {
    (glob as Vi.Mock).mockImplementation(() => [
      'fake/abis/directory/Bep20.json',
      'fake/abis/directory/GovernorBravoDelegate.json',
      'fake/abis/directory/IsolatedPoolComptroller.json',
      'fake/abis/directory/JumpRateModel.json',
      'fake/abis/directory/JumpRateModelV2.json',
    ]);

    (cwd as Vi.Mock).mockImplementation(() => 'fake/cwd/path');
  });

  it('calls runTypeChain and writeFile with the right arguments', async () => {
    await generateTypes({
      contractConfigs: fakeContractConfigs,
      abiDirectoryPath: 'fake/abi/directory/path',
      contractTypesOutputDirectoryPath: 'fake/contract/types/output/directory/path',
      typesOutputDirectoryPath: 'fake/types/output/directory/path',
    });

    expect(glob).toHaveBeenCalledTimes(1);
    expect((glob as Vi.Mock).mock.calls[0]).toMatchSnapshot();

    expect(runTypeChain).toHaveBeenCalledTimes(1);
    expect((runTypeChain as Vi.Mock).mock.calls[0]).toMatchSnapshot();

    expect(writeFile).toHaveBeenCalledTimes(1);
    expect((writeFile as Vi.Mock).mock.calls[0]).toMatchSnapshot();
  });
});
