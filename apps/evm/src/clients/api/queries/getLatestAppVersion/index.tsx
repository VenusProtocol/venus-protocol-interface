import { version as APP_VERSION } from 'constants/version';

export type GetLatestAppVersionOutput = {
  version?: string;
};

export const PUBLIC_VERSION_FILE_URL = `${window.location.origin}/version.json`;

export const getLatestAppVersion = async (): Promise<GetLatestAppVersionOutput> => {
  const data = await fetch(PUBLIC_VERSION_FILE_URL);
  const { version } = await data.json();

  console.log('Fetched version', version);
  console.log('Local version', APP_VERSION);

  return {
    version,
  };
};
