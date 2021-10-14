import addresses from '../config/contracts';

const chainId = process.env.REACT_APP_CHAIN_ID;

export const getVaiTokenAddress = () => {
  return addresses.vaiToken[chainId];
};

export const getVaiVaultAddress = () => {
  return addresses.vaiVault[chainId];
};

export const getVaultAddress = () => {
  return addresses.vault[chainId];
};

export const getXvsStoreAddress = () => {
  return addresses.xvsStore[chainId];
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
