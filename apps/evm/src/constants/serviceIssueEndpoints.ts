import type { RestServiceInput } from 'utilities/restService';

export const SERVICE_ISSUE_EXEMPT_ENDPOINTS: Pick<RestServiceInput, 'method' | 'endpoint'>[] = [
  { method: 'GET', endpoint: '/web3-domain-name' },
  { method: 'GET', endpoint: '/authentication/:accountAddress' },
  { method: 'GET', endpoint: '/find-swap' },
  { method: 'GET', endpoint: '/pendle/swap-calldata' },
  { method: 'GET', endpoint: '/ohlc/history' },
];
