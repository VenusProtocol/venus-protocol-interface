import genericContractInfos, {
  GenericContractName,
  GenericContractTypeByName,
} from './genericContractInfos';
import swapRouter, {
  SwapRouterContractName,
  SwapRouterContractType,
} from './swapRouterContractInfos';
import uniqueContractInfos, {
  UniqueContractName,
  UniqueContractTypeByName,
} from './uniqueContractInfos';

export const contractInfos = {
  ...uniqueContractInfos,
  ...genericContractInfos,
  swapRouter,
};

export type ContractName = keyof typeof contractInfos;

export type ContractTypeByName<TContractName extends ContractName> =
  TContractName extends UniqueContractName
    ? UniqueContractTypeByName<TContractName>
    : TContractName extends GenericContractName
    ? GenericContractTypeByName<TContractName>
    : TContractName extends SwapRouterContractName
    ? SwapRouterContractType
    : never;

export { default as uniqueContractInfos } from './uniqueContractInfos';
export * from './uniqueContractInfos';

export { default as genericContractInfos } from './genericContractInfos';
export * from './genericContractInfos';

export { default as swapRouter } from './swapRouterContractInfos';
export * from './swapRouterContractInfos';
