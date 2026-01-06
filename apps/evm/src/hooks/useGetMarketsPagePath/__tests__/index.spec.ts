import { useGetMarketsPagePath } from '..';

describe('useGetMarketsPagePath', () => {
  it('returns the correct Markets page path', async () => {
    const result = useGetMarketsPagePath();

    expect(result).toMatchInlineSnapshot(`
      {
        "marketsPagePath": "/markets/0x94d1820b2D1c7c7452A163983Dc888CEC546b77D",
      }
    `);
  });
});
