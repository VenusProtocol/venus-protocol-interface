import { restService } from './restService';

export const fetchMarkets = async () => {
  return restService({
    api: `/governance/venus`,
    method: 'GET',
    params: {}
  });
};
