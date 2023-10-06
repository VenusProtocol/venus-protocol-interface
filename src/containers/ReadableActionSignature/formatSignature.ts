import type { Result } from '@ethersproject/abi';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { ParamType } from 'ethers/lib/utils';
import { ProposalAction } from 'types';

import { FormValues } from 'pages/Governance/ProposalList/CreateProposalModal/proposalSchema';

const formatParamType = (paramType: ParamType): string => {
  if (paramType.type !== 'tuple' && paramType.type !== 'tuple[]') {
    return paramType.type;
  }

  let res = `tuple(${paramType.components.map(formatParamType).join(', ')})`;

  if (paramType.baseType === 'array') {
    res += '[]';
  }

  return res;
};

const formatArgToReadableFormat = (argument: Result): string => {
  if (Array.isArray(argument)) {
    return `[${argument.map(formatArgToReadableFormat).join(', ')}]`;
  }

  if (typeof argument === 'string') {
    return `"${argument}"`;
  }

  // eslint-disable-next-line no-underscore-dangle
  if (argument._isBigNumber) {
    // eslint-disable-next-line no-underscore-dangle
    return new BigNumber(argument._hex).toString();
  }

  return argument.toString();
};

const formatSignature = (action: FormValues['actions'][number] | ProposalAction) => {
  try {
    const fragment = ethers.utils.FunctionFragment.from(action.signature);
    let args: string[] = [];

    if (Array.isArray(action.callData)) {
      args = fragment.inputs
        .map((i, idx) => {
          const res = action.callData[idx];
          return i.baseType === 'string' || i.baseType === 'address' ? `"${res}"` : res;
        })
        .filter((item): item is string => item !== undefined || item !== null);
    } else {
      const unformattedArgs = ethers.utils.defaultAbiCoder.decode(
        fragment.inputs.map(formatParamType),
        action.callData,
      );

      args = unformattedArgs.map(formatArgToReadableFormat);
    }

    return `.${fragment.name}(${args.join(', ')})`;
  } catch (err) {
    console.error(err);
  }

  return '';
};

export default formatSignature;
