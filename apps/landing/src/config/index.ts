import { envVariables } from './envVariables';

export interface Config {
  posthog: {
    apiKey: string;
    hostUrl: string;
  };
}

const config: Config = {
  posthog: {
    apiKey: envVariables.VITE_POSTHOG_API_KEY || '',
    hostUrl: envVariables.VITE_POSTHOG_HOST_URL || '',
  },
};

export { envVariables } from './envVariables';
export default config;
