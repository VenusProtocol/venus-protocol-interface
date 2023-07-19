import BigNumber from 'bignumber.js';

import calculateApy from '..';

describe('utilities/calculateApy', () => {
  it('should calculate APY for given daily distributed tokens and decimals', () => {
    const dailyDistributedTokens = new BigNumber(1.05);
    const decimals = 2;

    expect(calculateApy({ dailyDistributedTokens, decimals })).toMatchInlineSnapshot(
      '"3.00888385706893783764029234283348532260838136037027640924543793007888301151592248510719543309643704919475841543572e+115"',
    );
  });
});
