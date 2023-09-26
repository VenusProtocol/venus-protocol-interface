import { generatePseudoRandomRefetchInterval } from '..';

describe('generatePseudoRandomRefetchInterval', () => {
  beforeEach(() => {
    vi.spyOn(global.Math, 'random').mockReturnValue(0.123456789);
  });

  afterEach(() => {
    vi.spyOn(global.Math, 'random').mockRestore();
  });

  it('returns a number from 9000 to 15000', () => {
    const result = generatePseudoRandomRefetchInterval();
    expect(result).toMatchInlineSnapshot('9741');
  });
});
