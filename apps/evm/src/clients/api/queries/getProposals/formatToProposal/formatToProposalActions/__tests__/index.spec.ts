import { formatToProposalActions } from '..';

describe('formatToProposalActions', () => {
  it('returns proposal actions in the correct format', async () => {
    const res = formatToProposalActions({
      actions: [
        {
          calldata: '0x3c23ddffD7e86919df33e11552b12DdDed236706',
          signature: 'fakeSignature1()',
          targetAddress: '0x2Ce1d0ffd7e869d9df33e28552b12DdDed326706',
          valueMantissa: '0',
        },
        {
          calldata: '0x0102',
          signature: 'fakeSignature2()',
          targetAddress: '0x3Ce1d0ffd7e869d9df33e28552b12DdDed326706',
          valueMantissa: '1000000',
        },
        {
          calldata: '0x0102',
          signature: '',
          targetAddress: '0x3Ce1d0ffd7e869d9df33e28552b12DdDed326706',
          valueMantissa: '0',
        },
      ],
    });

    expect(res).toMatchSnapshot();
  });
});
