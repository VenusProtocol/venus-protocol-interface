import type { Mock } from 'vitest';

import { displayServiceIssueNotification } from 'libs/notifications';

import { restService } from '../restService';

vi.mock('libs/notifications', () => ({
  displayServiceIssueNotification: vi.fn(),
}));

const mockFetch = (response: { status: number; body?: unknown } | Error) =>
  vi
    .spyOn(globalThis, 'fetch')
    .mockImplementation(async () =>
      response instanceof Error
        ? Promise.reject(response)
        : new Response(JSON.stringify(response.body ?? {}), { status: response.status }),
    );

const address = '0x0000000000000000000000000000000000000001';

describe('restService', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    (displayServiceIssueNotification as Mock).mockClear();
  });

  it.each([500, 502, 503, 504])(
    'shows the service issue toast with the request details on a %s',
    async status => {
      mockFetch({ status, body: { error: 'Upstream timeout' } });

      await restService({ endpoint: '/pools', method: 'GET', params: { chainId: 56 } });

      expect(displayServiceIssueNotification).toHaveBeenCalledTimes(1);
      expect(displayServiceIssueNotification).toHaveBeenCalledWith({
        method: 'GET',
        endpoint: '/pools',
        status,
        error: 'Upstream timeout',
      });
    },
  );

  it('shows the toast when a 5xx response has no JSON body', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(
      async () => new Response('Bad Gateway', { status: 502 }),
    );

    await restService({ endpoint: '/spoke/pools', method: 'GET' });

    expect(displayServiceIssueNotification).toHaveBeenCalledWith({
      method: 'GET',
      endpoint: '/spoke/pools',
      status: 502,
      error: undefined,
    });
  });

  it.each([200, 400, 403, 404, 429])('stays silent on a %s', async status => {
    mockFetch({ status });

    await restService({ endpoint: '/pools', method: 'GET' });

    expect(displayServiceIssueNotification).not.toHaveBeenCalled();
  });

  it('stays silent when the request cannot be sent, as for offline or timeouts', async () => {
    mockFetch(new Error('Network error'));

    await restService({ endpoint: '/pools', method: 'GET' });

    expect(displayServiceIssueNotification).not.toHaveBeenCalled();
  });

  it.each([
    '/web3-domain-name',
    `/authentication/${address}`,
    '/find-swap',
    '/pendle/swap-calldata',
    '/ohlc/history',
  ])('stays silent for the exempt endpoint %s', async endpoint => {
    mockFetch({ status: 503 });

    await restService({ endpoint, method: 'GET' });

    expect(displayServiceIssueNotification).not.toHaveBeenCalled();
  });

  it('matches exempt endpoints exactly, segment by segment and by method', async () => {
    mockFetch({ status: 503 });

    await restService({ endpoint: '/authentication/0x1/extra', method: 'GET' });
    await restService({ endpoint: '/find-swap/extra', method: 'GET' });
    await restService({ endpoint: '/find-swap', method: 'POST' });

    expect(displayServiceIssueNotification).toHaveBeenCalledTimes(3);
  });

  it('ignores the query string when matching an exempt endpoint', async () => {
    mockFetch({ status: 503 });

    await restService({ endpoint: '/ohlc/history?interval=1h', method: 'GET' });

    expect(displayServiceIssueNotification).not.toHaveBeenCalled();
  });

  it.each([
    '/fixed-rate-vaults',
    '/governance/proposals?limit=1',
    '/governance/proposals/votes',
    '/governance/voters',
    '/liquidity-hub/hubs',
    '/markets/tvl',
    '/pools',
    '/price',
    '/prime/cycle/current',
    '/prime/cycles',
    '/prime/leaderboard',
    '/prime/minimum-stake',
    '/prime/rewards-leaderboard',
    '/protocol-reserve/destination-amounts',
    '/spoke/pools',
    `/account/${address}/net-worth`,
    `/account/${address}/performance`,
    `/account/${address}/transactions`,
    `/account/${address}/yield-plus/positions?chainId=56&isActive=true`,
    '/governance/proposals/1/voteSummary',
    `/governance/voters/${address}/history`,
    `/governance/voters/${address}/summary`,
    `/liquidity-hub/hubs/${address}/history`,
    `/liquidity-hub/hubs/${address}`,
    `/prime/cycles/3/users/${address}`,
    '/prime/cycles/3',
    `/prime/users/${address}/pending-rewards`,
    `/spoke/markets/${address}/history`,
  ])('shows the toast when %s returns a 5xx', async endpoint => {
    mockFetch({ status: 503 });

    await restService({ endpoint, method: 'GET' });

    expect(displayServiceIssueNotification).toHaveBeenCalledTimes(1);
    expect(displayServiceIssueNotification).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint, status: 503 }),
    );
  });

  it('stays silent for APIs other than the Venus API', async () => {
    mockFetch({ status: 503 });

    await restService({ baseUrl: 'https://other.api', endpoint: '/pools', method: 'GET' });

    expect(displayServiceIssueNotification).not.toHaveBeenCalled();
  });
});
