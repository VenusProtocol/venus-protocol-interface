import _isEmpty from 'lodash/isEmpty';
import _set from 'lodash/set';

import config from 'config';
import { logError } from 'libs/errors';

interface RestServiceInput {
  endpoint: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  next?: boolean;
  token?: string | null;
  params?: Record<string, unknown>;
}

interface ApiErrorResponse {
  status: number;
  data: {
    error: string;
  };
}

type ApiResponse<D> =
  | {
      status: number;
      data: D | undefined;
    }
  | ApiErrorResponse;

const createQueryParams = (params: Record<string, unknown>) => {
  const paramArray = Object.entries(params).map(([key, value]) => {
    if (value !== undefined && value !== null) {
      return `${key}=${value}`;
    }
    return '';
  });
  return paramArray.filter(p => p).join('&');
};

export async function restService<D>({
  endpoint,
  method,
  params,
  token = null,
  next = false,
}: RestServiceInput): Promise<ApiResponse<D>> {
  const headers = {};
  let path = `${config.apiUrl}${endpoint}`;

  _set(headers, 'Accept', 'application/json');

  if (next) {
    _set(headers, 'Accept-Version', 'next');
  } else {
    _set(headers, 'Accept-Version', 'stable');
  }

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
        if (warning && config.isLocalServer) {
          logError(warning);
        }
      } catch {
        // Do nothing
      }

      return { status, data };
    })
    .catch(error => ({
      status: error.status,
      data: {
        error,
      },
    }));
}
