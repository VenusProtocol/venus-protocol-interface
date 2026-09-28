import type { RestServiceInput } from 'utilities/restService';

export const SERVICE_ISSUE_ENDPOINTS: Pick<RestServiceInput, 'method' | 'endpoint'>[] = [
  { method: 'GET', endpoint: '/spoke/pools' },
  { method: 'GET', endpoint: '/spoke/positions' },
];
