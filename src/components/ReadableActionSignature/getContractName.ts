import { swapRouter, uniqueContractInfos } from 'packages/contracts';
import { ChainId } from 'types';
import { areAddressesEqual, getTokenByAddress, getVTokenByAddress } from 'utilities';

export interface GetContractNameInput {
  target: string;
  chainId?: ChainId;
}

const getContractName = ({ target, chainId }: GetContractNameInput) => {
  // Search within tokens
  const token = getTokenByAddress(target);
  if (token) {
    return token.symbol;
  }

  // Search within vTokens
  const vToken = getVTokenByAddress(target);
  if (vToken) {
    return vToken.symbol;
  }

  if (!chainId) {
    return target;
  }

  // Search within unique contracts
  const matchingUniqueContractInfo = Object.entries(uniqueContractInfos).find(
    ([_uniqueContractName, uniqueContractInfo]) => {
      const contractAddress = uniqueContractInfo.address[chainId];
      return !!contractAddress && areAddressesEqual(contractAddress, target);
    },
  );

  if (matchingUniqueContractInfo) {
    const contractName = matchingUniqueContractInfo[0];
    return `${contractName.charAt(0).toUpperCase()}${contractName.slice(1)}`;
  }

  // Search within swap router contracts
  const swapRouterAddresses = swapRouter.address[chainId];
  const matchesSwapRouterAddress =
    swapRouterAddresses &&
    Object.values(swapRouterAddresses).some(swapRouterAddress =>
      areAddressesEqual(swapRouterAddress, target),
    );

  if (matchesSwapRouterAddress) {
    return 'SwapRouter';
  }

  return target;
};

export default getContractName;
