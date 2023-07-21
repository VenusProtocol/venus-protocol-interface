import * as contractInfos from './contractInfos';

export * from './types/general';
export * from './types/contractName';

export const contracts = contractInfos;
export { default as getContract } from './getContract';
