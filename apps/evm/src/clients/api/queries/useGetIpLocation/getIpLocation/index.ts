import { VError } from 'libs/errors';

type GetIpLocationApiResponse = {
  // This provider reports failures with a 200, so the flag has to be checked alongside the code
  success?: boolean;
  country_code?: string;
};

export interface GetIpLocationOutput {
  countryCode: string;
}

export const IP_API_URL = 'https://ipwho.is/';

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

  if (payload.success === false || !payload.country_code) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: { exception: payload },
    });
  }

  return {
    countryCode: payload.country_code,
  };
};
