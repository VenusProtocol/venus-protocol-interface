import { set, isEmpty } from 'lodash';
import { API_ENDPOINT_URL } from '../config';

interface IBaseArgs {
  api: string;
  third_party?: boolean;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  token?: string | null;
}
interface IJsonArgs extends IBaseArgs {
  contentType?: 'json';
  params?: Record<string, unknown>;
}
interface IMultiFormArgs extends IBaseArgs {
  contentType: 'multi-form';
  params: Record<string, string | Blob>;
}

export async function restService<D>({
  api,
  third_party,
  method,
  params,
  contentType = 'json',
  token = null,
}: IJsonArgs | IMultiFormArgs): Promise<
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
  let path = `${API_ENDPOINT_URL}${api}`;

  if (third_party) {
    path = api;
  }

  const formData = new FormData();
  if (params && contentType === 'multi-form') {
    Object.keys(params as Record<string, string | Blob>).forEach(key => {
      if (params[key] !== null && key !== 'token') {
        formData.append(key, params[key] as string | Blob);
      }
    });
  } else {
    set(headers, 'Accept', 'application/json');
    set(headers, 'Content-Type', 'application/json');
  }

  if (token) {
    set(headers, 'Authorization', `Bearer ${token}`);
  }
  const reqBody = {
    method,
    headers,
    body: {},
  };
  if (contentType === 'multi-form') {
    reqBody.body = formData;
  } else if (!isEmpty(params)) {
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
