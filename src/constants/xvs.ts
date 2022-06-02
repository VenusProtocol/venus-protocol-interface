import { getToken, getContractAddress } from 'utilities';

export const XVS_TOKEN_ID = 'xvs';
export const XVS_TOKEN_ADDRESS = getToken(XVS_TOKEN_ID).address;
<<<<<<< HEAD:src/constants/xvs.ts
export const XVS_VAULT_PROXY_CONTRACT_ADDRESS = getContractAddress('xvsVaultProxy');
export const XVS_DECIMAL = getToken(XVS_TOKEN_ID).decimals;
=======
export const XVS_VAULT_ADDRESS = getContractAddress('xvsVault');
>>>>>>> ef821efc (decouple useGetVaults):src/clients/api/queries/useGetVaults/constants.ts
