import fakeTokenCombinations from '__mocks__/models/tokenCombinations';

import generateTokenCombinationIds from '../generateTokenCombinationIds';

describe('api/queries/getPancakeSwapPairs/generateTokenCombinationIds', () => {
  test('generates unique IDs for provided token combinations', async () => {
    const res = generateTokenCombinationIds(fakeTokenCombinations);

    expect(res).toMatchSnapshot();
  });
});
