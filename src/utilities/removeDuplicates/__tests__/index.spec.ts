import { removeDuplicates } from '..';

describe('removeDuplicates', () => {
  it('filters out duplicates from an array of strings and numbers', () => {
    const result = removeDuplicates(['duplicate', 1, 'duplicate', 2, 3, 'unique', 2]);
    expect(result).toMatchInlineSnapshot(`
      [
        "duplicate",
        1,
        2,
        3,
        "unique",
      ]
    `);
  });
});
