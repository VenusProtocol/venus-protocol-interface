import { convertAprToApy } from '..';

describe('convertAprToApy', () => {
  it('converts APR bips to APY', () => {
    const res = convertAprToApy({
      aprBips: '23',
    });

    expect(res).toMatchInlineSnapshot('"0.23026397657694986"');
  });
});
