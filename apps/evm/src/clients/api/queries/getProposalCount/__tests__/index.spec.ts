import type { Mock } from 'vitest';

import { restService } from 'utilities';

import { getProposalCount } from '..';

vi.mock('utilities/restService');

describe('getProposalCount', () => {
  it('returns proposal count', async () => {
    (restService as Mock).mockResolvedValue({
      data: { total: 42 },
    });

    const response = await getProposalCount();

    expect(restService).toHaveBeenCalledWith({
      endpoint: '/governance/proposals?limit=1',
      method: 'GET',
    });

    expect(response).toMatchSnapshot();
  });

  it('throws on error in payload', async () => {
    (restService as Mock).mockResolvedValue({ data: { error: 'Some error' } });

    await expect(getProposalCount()).rejects.toMatchObject({
      code: 'somethingWentWrong',
    });
  });

  it('throws on undefined payload', async () => {
    (restService as Mock).mockResolvedValue({ data: undefined });

    await expect(getProposalCount()).rejects.toMatchObject({
      code: 'somethingWentWrong',
    });
  });
});
