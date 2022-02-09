import { restService } from './restService';

export const fetchMarkets = async () =>
  restService({
    api: '/governance/venus',
    method: 'GET',
    params: {},
  });
