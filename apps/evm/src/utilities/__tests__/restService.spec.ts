import type { Mock } from 'vitest';

import { displayServiceIssueNotification } from 'libs/notifications';

import { restService } from '../restService';

vi.mock('libs/notifications', () => ({
  displayServiceIssueNotification: vi.fn(),
}));

const mockFetch = (response: { status: number } | Error) =>
  vi
    .spyOn(globalThis, 'fetch')
    .mockImplementation(async () =>
      response instanceof Error
        ? Promise.reject(response)
        : new Response(JSON.stringify({}), { status: response.status }),
    );

describe('restService', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    (displayServiceIssueNotification as Mock).mockClear();
  });

  it('shows the service issue toast when a listed endpoint fails', async () => {
    mockFetch({ status: 503 });

    await restService({ endpoint: '/spoke/pools', method: 'GET' });

    expect(displayServiceIssueNotification).toHaveBeenCalledTimes(1);
  });

  it('shows the service issue toast when a listed endpoint cannot be reached', async () => {
    mockFetch(new Error('Network error'));

    await restService({ endpoint: '/spoke/pools', method: 'GET' });

    expect(displayServiceIssueNotification).toHaveBeenCalledTimes(1);
  });

  it('stays silent when a listed endpoint succeeds', async () => {
    mockFetch({ status: 200 });

    await restService({ endpoint: '/spoke/pools', method: 'GET' });

    expect(displayServiceIssueNotification).not.toHaveBeenCalled();
  });

  it('stays silent for endpoints outside the list, including ones sharing a prefix', async () => {
    mockFetch({ status: 503 });

    await restService({ endpoint: '/spoke/markets/0x1/history', method: 'GET' });
    await restService({ endpoint: '/spoke/pools/extra', method: 'GET' });
    await restService({ endpoint: '/pools', method: 'GET' });

    expect(displayServiceIssueNotification).not.toHaveBeenCalled();
  });

  it('stays silent when a listed endpoint is called on another API', async () => {
    mockFetch({ status: 503 });

    await restService({ baseUrl: 'https://other.api', endpoint: '/spoke/pools', method: 'GET' });

    expect(displayServiceIssueNotification).not.toHaveBeenCalled();
  });
});
