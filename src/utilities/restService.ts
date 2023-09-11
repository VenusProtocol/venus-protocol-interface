import config from 'config';
import _isEmpty from 'lodash/isEmpty';
import _set from 'lodash/set';

import { logError } from 'context/ErrorLogger';

interface RestServiceInput {
  endpoint: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  token?: string | null;
  params?: Record<string, unknown>;
  next?: boolean;
}

interface ApiErrorResponse {
  status: boolean;
  data: undefined;
  result: 'error';
  message: string;
}

type ApiResponseV1<D> =
  | {
      status: number;
      data: { data: D; status: boolean } | undefined;
    }
  | ApiErrorResponse;

type ApiResponseV2<D> =
  | {
      status: number;
      data: D | undefined;
    }
  | ApiErrorResponse;

type ApiResponseSignature = 'v1' | 'v2';

const createQueryParams = (params: Record<string, unknown>) => {
  const paramArray = Object.entries(params).map(([key, value]) => {
    if (value !== undefined && value !== null) {
      return `${key}=${value}`;
    }
    return '';
  });
  return paramArray.filter(p => p).join('&');
};

export async function restService<D, N extends ApiResponseSignature>({
  endpoint,
  method,
  params,
  token = null,
  next = false,
}: RestServiceInput): Promise<N extends 'v2' ? ApiResponseV2<D> : ApiResponseV1<D>> {
  const headers = {};
  let path = `${config.apiUrl}${endpoint}`;

  _set(headers, 'Accept', 'application/json');

  if (next) {
    _set(headers, 'Accept-Version', 'next');
  } else {
    _set(headers, 'Accept-Version', 'stable');
  }

  if (token) {
    _set(headers, 'Authorization', `Bearer ${token}`);
  }

  const reqBody = {
    method,
    headers,
    body: {},
  };

  if (params && !_isEmpty(params) && method === 'POST') {
    reqBody.body = JSON.stringify(params);
  } else if (params && !_isEmpty(params) && method === 'GET') {
    const queryParams = createQueryParams(params);
    path = `${path}?${queryParams}`;
  }
  return fetch(path, { headers })
    .then(async response => {
      const { status } = response;

      let data: undefined;

      try {
        data = await response.json();
        const warning = response.headers.get('Warning');
        if (warning) {
          logError(warning);
        }
      } catch (error) {
        // Do nothing
      }

      return { status, data };
    })
    .catch(error => ({
      status: false,
      data: undefined,
      result: 'error',
      message: error,
    }));
}
