import type { Mock } from 'vitest';

import { fakeContractConfigs } from 'libs/contracts/__testUtils__/fakeConfig';
import type { GetAbsolutePathInput } from 'libs/contracts/utilities/getAbsolutePath';

import { generateContracts } from '..';
import { generateAbis } from '../generateAbis';
import { generateAddressList } from '../generateAddressList';

vi.mock('utilities/writeFile');
vi.mock('../generateAddressList');
vi.mock('../generateAbis');
vi.mock('libs/contracts/utilities/getAbsolutePath', () => ({
  getAbsolutePath: ({ relativePath }: GetAbsolutePathInput) => relativePath,
}));

describe('generateContracts', () => {
  it('calls generative functions with the right arguments', async () => {
    await generateContracts({
      contractConfigs: fakeContractConfigs,
    });

    expect(generateAddressList).toHaveBeenCalledTimes(1);
    expect((generateAddressList as Mock).mock.calls[0]).toMatchSnapshot();

    expect(generateAbis).toHaveBeenCalledTimes(1);
    expect((generateAbis as Mock).mock.calls[0]).toMatchSnapshot();
  });
});
