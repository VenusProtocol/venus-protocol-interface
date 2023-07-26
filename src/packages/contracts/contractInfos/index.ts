import fixedAddressContractInfos, {
  FixedAddressContractName,
  FixedAddressContractTypeByName,
} from './fixedAddressContractInfos';
import genericContractInfos, {
  GenericContractName,
  GenericContractTypeByName,
} from './genericContractInfos';
import swapRouter, {
  SwapRouterContractName,
  SwapRouterContractType,
} from './swapRouterContractInfos';

export const contractInfos = {
  ...fixedAddressContractInfos,
  ...genericContractInfos,
  swapRouter,
};

export type ContractName = keyof typeof contractInfos;

export type ContractTypeByName<TContractName extends ContractName> =
  TContractName extends FixedAddressContractName
    ? FixedAddressContractTypeByName<TContractName>
    : TContractName extends GenericContractName
    ? GenericContractTypeByName<TContractName>
    : TContractName extends SwapRouterContractName
    ? SwapRouterContractType
    : never;

export { default as fixedAddressContractInfos } from './fixedAddressContractInfos';
export * from './fixedAddressContractInfos';

export { default as genericContractInfos } from './genericContractInfos';
export * from './genericContractInfos';

export { default as swapRouter } from './swapRouterContractInfos';
export * from './swapRouterContractInfos';
