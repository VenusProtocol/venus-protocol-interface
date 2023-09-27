import { ContractConfig } from 'packages/contractsNew/config';

const isSwapRouterContractConfig = ({ name }: ContractConfig) => name === 'SwapRouter';

export default isSwapRouterContractConfig;
