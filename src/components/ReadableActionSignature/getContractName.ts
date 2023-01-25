import config from 'config';
import { ethers } from 'ethers';

import contractAddresses from 'constants/contracts/addresses/main.json';
import tokenAddresses from 'constants/contracts/addresses/tokens.json';
import vBepTokensAddresses from 'constants/contracts/addresses/vBepTokens.json';

const checkAndFormatContractName = (
  target: string,
  addressJson: typeof contractAddresses | typeof tokenAddresses | typeof vBepTokensAddresses,
) => {
  const found = Object.entries(addressJson).find(
    entry => entry[1][config.chainId].toLowerCase() === target.toLowerCase(),
  );

  if (found) {
    const name = found[0];
    return `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
  }
};

const getContractName = (target: string) => {
  let contractName;

  if (ethers.utils.isAddress(target)) {
    // Check main contracts
    contractName = checkAndFormatContractName(target, contractAddresses);
    // check token contracts
    if (!contractName) {
      contractName = checkAndFormatContractName(target, tokenAddresses);
    }

    if (!contractName) {
      // check v contracts
      contractName = checkAndFormatContractName(target, vBepTokensAddresses);
    }
  }

  return contractName || target;
};

export default getContractName;
