import { convertAprToApy } from '..';

describe('convertAprToApy', () => {
  it('converts APR bips to APY', () => {
    const res = convertAprToApy({
      aprBips: '23',
    });

    expect(res).toMatchInlineSnapshot('"2.3265798060834175"');
  });
});
