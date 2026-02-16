import { restService } from 'utilities';
import { type Mock, vi } from 'vitest';
import { getBurnedWBnb } from '..';

vi.mock('utilities/restService');

describe('getBurnedWBnb', () => {
  const fakePublicClient = {} as any;

  it('returns correct sum for multiple destinationAmounts', async () => {
    (restService as Mock).mockResolvedValue({
      data: [
        {
          destinationAmounts: [{ amount: '100' }, { amount: '200' }],
        },
        {
          destinationAmounts: [{ amount: '300' }],
        },
      ],
    });

    const response = await getBurnedWBnb({ publicClient: fakePublicClient });
    expect(response).toEqual({ burnedWBnbMantissa: 600n });
  });

  it('throws on error in payload', async () => {
    (restService as Mock).mockResolvedValue({ data: { error: 'Some error' } });

    await expect(getBurnedWBnb({ publicClient: fakePublicClient })).rejects.toMatchObject({
      code: 'somethingWentWrong',
    });
  });

  it('throws on undefined payload', async () => {
    (restService as Mock).mockResolvedValue({ data: undefined });

    await expect(getBurnedWBnb({ publicClient: fakePublicClient })).rejects.toMatchObject({
      code: 'somethingWentWrong',
    });
  });
});
