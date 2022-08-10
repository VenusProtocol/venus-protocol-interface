import type { Result } from '@ethersproject/abi';
import { ethers } from 'ethers';
import { ProposalAction } from 'types';

import { FormValues } from 'pages/Vote/CreateProposalModal/proposalSchema';

const formatSignature = (action: FormValues['actions'][number] | ProposalAction) => {
  try {
    const fragment = ethers.utils.FunctionFragment.from(action.signature || '');
    let args: Result = [];

    if (Array.isArray(action.callData)) {
      args = fragment.inputs.map((i, idx) => {
        if (i.baseType === 'string' || i.baseType === 'address') {
          return `"${action.callData[idx]}"`;
        }
        return action.callData[idx];
      });
    } else {
      const unformattedArgs = ethers.utils.defaultAbiCoder.decode(
        fragment.inputs.map(input => input.baseType),
        action.callData,
      );
      args = fragment.inputs.map((i, idx) => {
        if (i.baseType === 'string' || i.baseType === 'address') {
          return `"${unformattedArgs[idx]}"`;
        }
        return unformattedArgs[idx];
      });
    }

    return `.${fragment.name}(${args.join(', ')})`;
  } catch (err) {
    console.error(err);
  }

  return '';
};

export default formatSignature;
