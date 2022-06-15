import { ethers } from 'ethers';

const parseFunctionSignature = (value: string | undefined) => {
  try {
    // Throws error if invalid
    const fragment = ethers.utils.FunctionFragment.from(value || '');
    ethers.utils.defaultAbiCoder.getDefaultValue(fragment.inputs);
    return fragment;
  } catch (err) {
    return undefined;
  }
};

export default parseFunctionSignature;
