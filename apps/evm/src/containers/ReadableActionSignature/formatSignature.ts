import type { ProposalAction } from 'types';
import { parseFunctionSignature } from 'utilities';
import { decodeAbiParameters } from 'viem';

type Parameter = string | number | boolean | bigint;

const formatParams = (param: Parameter | Parameter[]): string => {
  if (Array.isArray(param)) {
    return param.map(formatParams).join(', ');
  }

  const readableParam = param.toString();

  if (typeof param === 'number' || typeof param === 'boolean' || typeof param === 'bigint') {
    return readableParam;
  }

  return `"${readableParam}"`;
};

const formatSignature = (action: ProposalAction) => {
  if (!action.signature) {
    return `.transferNativeToken(${action.value})`;
  }

  try {
    const abiItem = parseFunctionSignature(action.signature);

    if (!abiItem) {
      return '';
    }

    const params = decodeAbiParameters(abiItem.inputs, action.callData) as Parameter | Parameter[];
    return `.${abiItem.name}(${formatParams(params)})`;
  } catch (err) {
    console.error(err);
  }

  return '';
};

export default formatSignature;
