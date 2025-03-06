import { ethers } from 'ethers';

/**
 *
 * @param types - Array of solidity type
 * @param values - Array of values associated with types by order
 * @returns - encoded values for sending as part of a contract call
 */
const encodeParameters = (
  types: (string | ethers.utils.ParamType)[],
  values: (string | number | string[])[],
) => {
  const abi = new ethers.utils.AbiCoder();
  // values type on abi.encode is any
  return abi.encode(types, values as any);
};

export default encodeParameters;
