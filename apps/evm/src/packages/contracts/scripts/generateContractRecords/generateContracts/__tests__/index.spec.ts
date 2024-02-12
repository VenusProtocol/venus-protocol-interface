import Vi from 'vitest';

import { fakeContractConfigs } from 'packages/contracts/__testUtils__/fakeConfig';
import { GetAbsolutePathInput } from 'packages/contracts/utilities/getAbsolutePath';

import { generateContracts } from '..';
import { generateAbis } from '../generateAbis';
import { generateAddressList } from '../generateAddressList';
import { generateGetters } from '../generateGetters';
import { generateTypes } from '../generateTypes';

vi.mock('utilities/writeFile');
vi.mock('../generateAddressList');
vi.mock('../generateAbis');
vi.mock('../generateGetters');
vi.mock('../generateTypes');
vi.mock('packages/contracts/utilities/getAbsolutePath', () => ({
  getAbsolutePath: ({ relativePath }: GetAbsolutePathInput) => relativePath,
}));

describe('generateContracts', () => {
  it('calls generative functions with the right arguments', async () => {
    await generateContracts({
      contractConfigs: fakeContractConfigs,
    });

    expect(generateAddressList).toHaveBeenCalledTimes(1);
    expect((generateAddressList as Vi.Mock).mock.calls[0]).toMatchSnapshot();

    expect(generateAbis).toHaveBeenCalledTimes(1);
    expect((generateAbis as Vi.Mock).mock.calls[0]).toMatchSnapshot();

    expect(generateGetters).toHaveBeenCalledTimes(1);
    expect((generateGetters as Vi.Mock).mock.calls[0]).toMatchSnapshot();

    expect(generateTypes).toHaveBeenCalledTimes(1);
    expect((generateTypes as Vi.Mock).mock.calls[0]).toMatchSnapshot();
  });
});
