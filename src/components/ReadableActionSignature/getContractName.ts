import config from 'config';
import { swapRouter, uniqueContractInfos } from 'packages/contracts';
import { getTokenByAddress, getVTokenByAddress } from 'utilities';

// Map contract names by address
const contractAddressMapping: {
  [address: string]: string;
} = {};

// TODO: get from auth context
const { chainId } = config;

Object.entries(uniqueContractInfos).forEach(([contractName, contractInfo]) => {
  const contractAddress = contractInfo.address[chainId];

  if (contractAddress) {
    contractAddressMapping[contractAddress.toLowerCase()] = `${contractName
      .charAt(0)
      .toUpperCase()}${contractName.slice(1)}`;
  }
});

// Swap router contracts
const swapRouterAddresses = swapRouter.address[chainId];

if (swapRouterAddresses) {
  Object.values(swapRouterAddresses).forEach(swapRouterAddress => {
    contractAddressMapping[swapRouterAddress.toLowerCase()] = 'SwapRouter';
  });
}

export interface GetContractNameInput {
  target: string;
}

const getContractName = ({ target }: GetContractNameInput) => {
  let contractName;

  const knownContractName = contractAddressMapping[target.toLowerCase()];
  if (knownContractName) {
    return knownContractName;
  }

  const token = getTokenByAddress(target);
  if (token) {
    return token.symbol;
  }

  const vToken = getVTokenByAddress(target);
  if (vToken) {
    return vToken.symbol;
  }

  return contractName || target;
};

export default getContractName;
