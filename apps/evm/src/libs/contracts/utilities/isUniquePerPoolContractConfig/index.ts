import type { ContractConfig } from 'libs/contracts/config';

const uniquePerPoolContracts = ['SwapRouter', 'NativeTokenGateway'];

export const isUniquePerPoolContractConfig = ({ name }: ContractConfig) =>
  uniquePerPoolContracts.includes(name);
