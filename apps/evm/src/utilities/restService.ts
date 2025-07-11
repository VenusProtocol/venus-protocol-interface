import _isEmpty from 'lodash/isEmpty';
import _set from 'lodash/set';

import config from 'config';
import { logError } from 'libs/errors';

export interface RestServiceInput {
  baseUrl?: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  next?: boolean;
  token?: string | null;
  params?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  status: number;
  data: {
    error: string;
  };
}

export type ApiResponse<D> =
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
  baseUrl,
  endpoint,
  method,
  params,
  token = null,
  next = false,
}: RestServiceInput): Promise<ApiResponse<D>> {
  const headers = {};
  const basePath = baseUrl ?? config.apiUrl;
  let path = `${basePath}${endpoint}`;

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
      } catch (err) {
        logError(err);
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
