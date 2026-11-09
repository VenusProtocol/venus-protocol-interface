import { convertAprBipsToApy } from '..';

describe('convertAprBipsToApy', () => {
  it('converts APR bips to APY', () => {
    const res = convertAprBipsToApy({
      aprBips: '23',
    });

    expect(res).toMatchInlineSnapshot('"0.2303"');
  });
});
