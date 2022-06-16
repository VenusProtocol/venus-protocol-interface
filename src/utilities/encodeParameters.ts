import { ethers } from 'ethers';

const encodeParameters = (types: $TSFixMe, values: $TSFixMe) => {
  const abi = new ethers.utils.AbiCoder();
  return abi.encode(types, values);
};

export default encodeParameters;
