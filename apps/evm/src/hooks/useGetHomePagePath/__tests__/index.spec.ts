import { useGetHomePagePath } from '..';

describe('useGetHomePagePath', () => {
  it('returns the correct home page path', async () => {
    const result = useGetHomePagePath();

    expect(result).toMatchInlineSnapshot(`
      {
        "homePagePath": "/pool/0x94d1820b2D1c7c7452A163983Dc888CEC546b77D",
      }
    `);
  });
});
