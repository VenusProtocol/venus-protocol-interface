import { swapRouter, uniqueContractInfos } from 'packages/contracts';
import { ChainId, Token, VToken } from 'types';

import areAddressesEqual from 'utilities/areAddressesEqual';
import findTokenByAddress from 'utilities/findTokenByAddress';

export interface GetContractNameInput {
  target: string;
  vTokens: VToken[];
  tokens: Token[];
  chainId: ChainId;
}

const getContractName = ({ target, vTokens, tokens, chainId }: GetContractNameInput) => {
  // Search within tokens
  const token = findTokenByAddress({
    tokens,
    address: target,
  });

  if (token) {
    return token.symbol;
  }

  // Search within vTokens
  const vToken = findTokenByAddress({
    address: target,
    tokens: vTokens,
  });

  if (vToken) {
    return vToken.symbol;
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
