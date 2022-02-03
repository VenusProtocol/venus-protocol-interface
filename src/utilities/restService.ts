// @flow

// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'loda... Remove this comment to see the full error message
import { set, isEmpty } from 'lodash';
import { API_ENDPOINT_URL } from '../config';

export async function restService({
  api,
  third_party,
  method,
  params,
  contentType = 'json',
  token = null
}: 
$TSFixMe) {
  const headers = {};
  let path = `${API_ENDPOINT_URL}${api}`;

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
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'body' does not exist on type '{ method: ... Remove this comment to see the full error message
    reqBody.body = formData;
  } else if (!isEmpty(params)) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'body' does not exist on type '{ method: ... Remove this comment to see the full error message
    reqBody.body = JSON.stringify(params);
  } else if (Array.isArray(params)) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'body' does not exist on type '{ method: ... Remove this comment to see the full error message
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
