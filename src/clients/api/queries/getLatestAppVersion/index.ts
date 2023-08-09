export type GetLatestAppVersionOutput = {
  version: string;
};

export const PACKAGE_FILE_URL =
  'https://raw.githubusercontent.com/VenusProtocol/venus-protocol-interface/main/package.json';

const getLatestAppVersion = async (): Promise<GetLatestAppVersionOutput> => {
  const data = await fetch(PACKAGE_FILE_URL);
  const { version } = await data.json();

  return {
    version,
  };
};

export default getLatestAppVersion;
