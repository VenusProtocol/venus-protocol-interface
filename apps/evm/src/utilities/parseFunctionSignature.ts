import { type AbiFunction, parseAbiItem } from 'viem';

const parseFunctionSignature = (value: string | undefined) => {
  try {
    if (!value) return undefined;

    // Parse the function signature
    const fragment = parseAbiItem(`function ${value.replace(' ', '')}`);

    return fragment as AbiFunction;
  } catch {
    return undefined;
  }
};

export default parseFunctionSignature;
