import web3 from 'web3';
import contractAddresses from 'constants/contracts/addresses/main.json';
import tokenAddresses from 'constants/contracts/addresses/tokens.json';
import vBepTokensAddresses from 'constants/contracts/addresses/vBepTokens.json';
import { CHAIN_ID } from 'config';

const checkAndFormatContractName = (
  target: string,
  addressJson: typeof contractAddresses | typeof tokenAddresses | typeof vBepTokensAddresses,
) => {
  const found = Object.entries(addressJson).find(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([key, value]) => value[CHAIN_ID].toLowerCase() === target.toLowerCase(),
  );
  if (found) {
    const name = found[0];
    return `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
  }
};

const getContractName = (target: string) => {
  let contractName;
  if (web3.utils.isAddress(target)) {
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
