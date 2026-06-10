import { VError } from 'libs/errors';

type GetIpLocationApiResponse = {
  countryCode?: string;
};

export interface GetIpLocationOutput {
  countryCode: string;
}

export const IP_API_URL = 'https://free.freeipapi.com/api/json';

export const getIpLocation = async (): Promise<GetIpLocationOutput> => {
  let response: Response;

  try {
    response = await fetch(IP_API_URL);
  } catch (error) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: { exception: error },
    });
  }

  if (!response.ok) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: { exception: response },
    });
  }

  let payload: GetIpLocationApiResponse;

  try {
    payload = await response.json();
  } catch (error) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: { exception: error },
    });
  }

  if (!payload.countryCode) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: { exception: payload },
    });
  }

  return {
    countryCode: payload.countryCode,
  };
};
