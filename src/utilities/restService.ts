import config from 'config';
import { isEmpty, set } from 'lodash';

interface RestServiceInput {
  endpoint: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  token?: string | null;
  params?: Record<string, unknown>;
  next?: boolean;
}

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
}: RestServiceInput): Promise<
  | {
      status: number;
      data: D | undefined;
    }
  | {
      status: boolean;
      data: undefined;
      result: 'error';
      message: string;
    }
> {
  const headers = {};
  let path = `${config.apiUrl}${endpoint}`;

  set(headers, 'Accept', 'application/json');

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
  return fetch(path, { headers })
    .then(async response => {
      const { status } = response;

      let data: undefined;

      try {
        data = await response.json();
        const warning = response.headers.get('Warning');
        if (warning) {
          console.warn(warning);
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
