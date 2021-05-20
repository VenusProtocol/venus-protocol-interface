// @flow

import { set, isEmpty } from 'lodash';

export async function restService({
  api,
  third_party,
  method,
  params,
  contentType = 'json',
  token = null
}) {
  const headers = {};
  let path;

  if (process.env.REACT_APP_ENV !== 'prod') {
    path = `${process.env.REACT_APP_DEVELOPMENT_API}${api}`;
  } else {
    path = `${process.env.REACT_APP_PRODUCTION_API}${api}`;
  }

  if (third_party) {
    path = api;
  }

  const formData = new FormData();
  if (contentType === 'multi-form') {
    Object.keys(params).forEach(key => {
      if (params[key] !== null && key !== 'token') {
        formData.append(key, params[key]);
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
    headers
  };
  if (contentType === 'multi-form') {
    reqBody.body = formData;
  } else if (!isEmpty(params)) {
    reqBody.body = JSON.stringify(params);
  } else if (Array.isArray(params)) {
    reqBody.body = JSON.stringify([]);
  }

  return fetch(path, reqBody)
    .then(response => {
      return response.text().then(text => {
        return text
          ? { status: response.status, data: JSON.parse(text) }
          : { status: response.status };
      });
    })
    .catch(error => {
      return {
        result: 'error',
        message: error
      };
    });
}
