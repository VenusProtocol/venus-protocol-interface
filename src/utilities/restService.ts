import { set, isEmpty } from 'lodash';
import { API_ENDPOINT_URL } from '../config';

interface IRestServiceInput {
  endpoint: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  token?: string | null;
  params?: Record<string, unknown>;
}

export async function restService<D>({
  endpoint,
  method,
  params,
  token = null,
}: IRestServiceInput): Promise<
  | {
      status: number;
      data: { data: D; status: boolean } | undefined;
    }
  | {
      data: undefined;
      result: 'error';
      message: string;
      status: boolean;
    }
> {
  const headers = {};
  const path = `${API_ENDPOINT_URL}${endpoint}`;

  set(headers, 'Accept', 'application/json');
  set(headers, 'Content-Type', 'application/json');

  if (token) {
    set(headers, 'Authorization', `Bearer ${token}`);
  }

  const reqBody = {
    method,
    headers,
    body: {},
  };

  if (params && !isEmpty(params)) {
    reqBody.body = JSON.stringify(params);
  } else if (Array.isArray(params)) {
    reqBody.body = JSON.stringify([]);
  }

  return fetch(path)
    .then(response =>
      response
        .json()
        .then(json =>
          json
            ? { status: response.status, data: json }
            : { status: response.status, data: undefined },
        ),
    )
    .catch(error => ({
      status: false,
      data: undefined,
      result: 'error',
      message: error,
    }));
}
