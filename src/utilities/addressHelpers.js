import addresses from '../config/contracts';

const chainId = process.env.REACT_APP_CHAIN_ID;

export const getVaiTokenAddress = () => {
  return addresses.vaiToken[chainId];
};

export const getVaiVaultAddress = () => {
  return addresses.vaiVault[chainId];
};

export const getVaiUnitrollerAddress = () => {
  return addresses.vaiUnitroller[chainId];
};

export const getComptrollerAddress = () => {
  return addresses.comptroller[chainId];
};

export const getOracleAddress = () => {
  return addresses.oracle[chainId];
};

export const getVoteAddress = () => {
  return addresses.vote[chainId];
};

export const getVenusLensAddress = () => {
  return addresses.venusLens[chainId];
};

export const getXvsVaultAddress = () => {
  return addresses.xvsVault[chainId];
};

export const getXvsVaultProxyAddress = () => {
  return addresses.xvsVaultProxy[chainId];
};

export const getXvsVaultStoreAddress = () => {
  return addresses.xvsVaultStore[chainId];
};


