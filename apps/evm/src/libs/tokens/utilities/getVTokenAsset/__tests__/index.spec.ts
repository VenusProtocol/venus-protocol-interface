import { ChainId } from 'types';

import { getVTokenAsset } from '..';

describe('getVTokenAsset', () => {
  it('returns the asset corresponding to the passed VToken address and chain ID', () => {
    const result = getVTokenAsset({
      vTokenAddress: '0xAeB0FEd69354f34831fe1D16475D9A83ddaCaDA6'.toLowerCase(),
      chainId: ChainId.ARBITRUM_ONE,
    });

    expect(result).toMatchInlineSnapshot('"/src/libs/tokens/img/vTokens/vArbLsEth.svg"');
  });
});
