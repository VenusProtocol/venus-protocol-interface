import { getToken, getContractAddress } from 'utilities';

export const XVS_TOKEN_ID = 'xvs';
export const XVS_TOKEN_ADDRESS = getToken(XVS_TOKEN_ID).address;
export const XVS_VAULT_PROXY_CONTRACT_ADDRESS = getContractAddress('xvsVaultProxy');

export const VAI_TOKEN_ID = 'vai';
export const VAI_VAULT_ADDRESS = getContractAddress('vaiVault');
