import { formatToProposalActions } from '..';

describe('formatToProposalActions', () => {
  it('returns proposal actions in the correct format', async () => {
    const res = formatToProposalActions({
      callDatas: ['fake-call-data-1', 'fake-call-data-2'],
      signatures: ['fakeSignature1()', 'fakeSignature2()'],
      targets: [
        '0x2Ce1d0ffd7e869d9df33e28552b12DdDed326706',
        '0x3Ce1d0ffd7e869d9df33e28552b12DdDed326706',
      ],
      values: ['0', '1000000'],
    });

    expect(res).toMatchSnapshot();
  });
});
