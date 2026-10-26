import encodeCallData from '../encodeCallData';
import proposalSchema, { initialActionData } from '../proposalSchema';

const MAX_UINT256 =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935';

const buildFormValues = (callDataValue: string) => ({
  actions: [
    {
      ...initialActionData,
      target: '0x0000000000000000000000000000000000000001',
      signature: 'setAmount(uint256)',
      callData: [callDataValue],
    },
  ],
  title: 'Title',
  description: 'Description',
  forDescription: 'For',
  againstDescription: 'Against',
  abstainDescription: 'Abstain',
  proposalType: 0,
});

describe('proposalSchema', () => {
  it('accepts 2^256 - 1 as a uint256 parameter', async () => {
    await expect(proposalSchema.validate(buildFormValues(MAX_UINT256))).resolves.toBeDefined();
  });

  it('accepts an integer above the safe range as a uint256 parameter', async () => {
    await expect(
      proposalSchema.validate(buildFormValues('9007199254740993')),
    ).resolves.toBeDefined();
  });

  it('rejects exponent notation instead of rounding it', async () => {
    await expect(proposalSchema.validate(buildFormValues('1e24'))).rejects.toThrow();
  });

  it('rejects a large integer written with a trailing zero decimal', async () => {
    await expect(
      proposalSchema.validate(buildFormValues('12345678901234567890123.0')),
    ).rejects.toThrow();
  });

  it('still rejects a value that overflows uint256', async () => {
    await expect(
      proposalSchema.validate(
        buildFormValues(
          '115792089237316195423570985008687907853269984665640564039457584007913129639936',
        ),
      ),
    ).rejects.toThrow();
  });
});

describe('encodeCallData', () => {
  it('encodes 2^256 - 1 without rounding it', () => {
    expect(encodeCallData('setAmount(uint256)', [MAX_UINT256])).toBe(`0x${'f'.repeat(64)}`);
  });
});
