import { VError } from 'libs/errors';

type IpLocationApiResponse = Record<string, unknown>;

export interface GetIpLocationOutput {
  countryCode: string;
}

export const PROVIDER_TIMEOUT_MS = 3000;

interface IpLocationProvider {
  url: string;
  getCountryCode: (payload: IpLocationApiResponse) => unknown;
}

export const IP_LOCATION_PROVIDERS: IpLocationProvider[] = [
  {
    url: 'https://ipwho.is/',
    // This provider reports failures with a 200
    getCountryCode: payload => (payload.success === false ? undefined : payload.country_code),
  },
  {
    url: 'https://api.country.is/',
    getCountryCode: payload => payload.country,
  },
  {
    url: 'https://get.geojs.io/v1/ip/country.json',
    getCountryCode: payload => payload.country,
  },
];

const fetchCountryCode = async ({ url, getCountryCode }: IpLocationProvider) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      return undefined;
    }

    const payload: IpLocationApiResponse = await response.json();
    const countryCode = getCountryCode(payload);

    return typeof countryCode === 'string' && countryCode.length > 0 ? countryCode : undefined;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const getIpLocation = async (): Promise<GetIpLocationOutput> => {
  for (const provider of IP_LOCATION_PROVIDERS) {
    try {
      const countryCode = await fetchCountryCode(provider);

      if (countryCode) {
        return { countryCode };
      }
    } catch {
      // The next provider is the fallback
    }
  }

  throw new VError({
    type: 'unexpected',
    code: 'somethingWentWrong',
    data: { exception: 'No IP location provider returned a country code' },
  });
};
