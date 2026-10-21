import { VError } from 'libs/errors';

type IpLocationApiResponse = Record<string, unknown>;

export interface GetIpLocationOutput {
  countryCode: string;
}

// Country restrictions stay off until a provider answers, so a hanging one is given up on rather
// than allowed to hold that window open. AbortController rather than AbortSignal.timeout, which
// the oldest browsers in the production browserslist do not have
export const PROVIDER_TIMEOUT_MS = 3000;

interface IpLocationProvider {
  url: string;
  getCountryCode: (payload: IpLocationApiResponse) => unknown;
}

// Each provider names the country field differently, so they carry their own reader. They are
// queried one after the other until one answers, because a single source means any outage on its
// side silently turns country restrictions off for everyone.
export const IP_LOCATION_PROVIDERS: IpLocationProvider[] = [
  {
    url: 'https://ipwho.is/',
    // This provider reports failures with a 200, so the flag guards the country code
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
  // Sequential on purpose: the next provider is only called when the previous one came up empty
  for (const provider of IP_LOCATION_PROVIDERS) {
    try {
      const countryCode = await fetchCountryCode(provider);

      if (countryCode) {
        return { countryCode };
      }
    } catch {
      // Moving on to the next provider is the point, so a failure is not worth rethrowing
    }
  }

  throw new VError({
    type: 'unexpected',
    code: 'somethingWentWrong',
    data: { exception: 'No IP location provider returned a country code' },
  });
};
