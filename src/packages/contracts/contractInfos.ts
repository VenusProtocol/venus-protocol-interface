import { abi as IsolatedPoolComptrollerAbi } from '@venusprotocol/isolated-pools/artifacts/contracts/Comptroller.sol/Comptroller.json';
import { abi as MainPoolComptrollerAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Comptroller/Comptroller.sol/Comptroller.json';
import venusProtocolMainnetDeployments from '@venusprotocol/venus-protocol/networks/mainnet.json';
import venusProtocolTestnetDeployments from '@venusprotocol/venus-protocol/networks/testnet.json';

import { ChainId, ContractInfo } from './types/general';

export const mainPoolComptroller: ContractInfo = {
  address: {
    [ChainId.BSC_TESTNET]: venusProtocolTestnetDeployments.Contracts.Comptroller,
    [ChainId.BSC_MAINNET]: venusProtocolMainnetDeployments.Contracts.Comptroller,
  },
  abi: MainPoolComptrollerAbi,
};

export const isolatedPoolComptroller: ContractInfo = {
  abi: IsolatedPoolComptrollerAbi,
};
