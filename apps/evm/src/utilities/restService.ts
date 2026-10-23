import { isEmpty, set } from 'lodash-es';

import config from 'config';
import { logError } from 'libs/errors';
import { displayServiceIssueNotification } from 'libs/notifications';

import { isServiceIssueExempt } from './isServiceIssueExempt';

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
    code?: string;
  };
}

export type ApiResponse<D> =
  | {
      status: number;
      data: D | undefined;
    }
  | ApiErrorResponse;

export const createQueryParams = (params: Record<string, unknown>) => {
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

  set(headers, 'Accept', 'application/json');

  if (next) {
    set(headers, 'Accept-Version', 'next');
  } else {
    set(headers, 'Accept-Version', 'stable');
  }

  if (next) {
    set(headers, 'Accept-Version', 'next');
  } else {
    set(headers, 'Accept-Version', 'stable');
  }

  if (token) {
    set(headers, 'Authorization', `Bearer ${token}`);
  }

  const reqBody = {
    method,
    headers,
    body: {},
  };

  if (params && !isEmpty(params) && method === 'POST') {
    reqBody.body = JSON.stringify(params);
  } else if (params && !isEmpty(params) && method === 'GET') {
    const queryParams = createQueryParams(params);
    path = `${path}?${queryParams}`;
  }

  const shouldNotifyServiceIssue =
    basePath === config.apiUrl && !isServiceIssueExempt({ method, endpoint });

  return fetch(path, { headers })
    .then(async response => {
      const { status } = response;

      let data: undefined;

      try {
        data = await response.json();
      } catch (err) {
        logError(err);
      }

      if (shouldNotifyServiceIssue && status >= 500 && status < 600) {
        const apiError = (data as { error?: unknown } | undefined)?.error;

        displayServiceIssueNotification({
          method,
          endpoint,
          status,
          error: typeof apiError === 'string' ? apiError : undefined,
        });
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
