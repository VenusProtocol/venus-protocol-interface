import Path from 'constants/path';

const getFirstPathPart = (pathname: string) => pathname.substring(0, pathname.lastIndexOf('/'));

const isOnMarketDetailsPage = (pathname: string) =>
  getFirstPathPart(pathname) === getFirstPathPart(Path.MARKET_DETAILS);

export default isOnMarketDetailsPage;
