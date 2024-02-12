export type GetLatestAppVersionOutput = {
  version?: string;
};

export const PUBLIC_VERSION_FILE_URL = `${window.location.origin}/version.json`;

export const getLatestAppVersion = async (): Promise<GetLatestAppVersionOutput> => {
  const data = await fetch(PUBLIC_VERSION_FILE_URL);
  const { version } = await data.json();

  return {
    version,
  };
};
