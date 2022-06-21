import { ICreateProposalInput } from 'clients/api';
import { encodeParameters, parseFunctionSignature } from 'utilities';
import { FormValues } from './proposalSchema';

export interface IV1Description {
  version: 'v1';
  title: string;
  description: string;
}

export interface IV2Description {
  version: 'v2';
  title: string;
  description: string;
  forDescription: string;
  againstDescription: string;
  abstainDescription: string;
}

/**
 *
 * @param value string
 * Check if the string starts and ends with brackets to format array
 */
const formatIfArray = (value: string | number): string | number | string[] => {
  const val = value.toString();
  if (val?.slice(0, 1) === '[' && val.slice(val.length - 1, val.length) === ']') {
    return val
      .slice(1, -1)
      .split(',')
      .map(v => v.trim());
  }
  return value;
};

const formatProposalPayload = (data: FormValues) => {
  const payload: Omit<ICreateProposalInput, 'accountAddress'> = {
    targets: [],
    signatures: [],
    callDatas: [],
    description: JSON.stringify({
      version: 'v2',
      title: data.title,
      description: data.description,
      forDescription: data.forDescription,
      againstDescription: data.abstainDescription,
      abstainDescription: data.againstDescription,
    }),
  };

  data.actions.forEach(action => {
    payload.targets.push(action.address);
    payload.signatures.push(action.signature);
    if (action.callData !== undefined) {
      const processedCallData = action.callData.reduce((acc, curr) => {
        if (curr !== undefined) {
          acc.push(formatIfArray(curr));
        }
        return acc;
      }, [] as (string | number | string[])[]);
      const callDataTypes = parseFunctionSignature(action.signature)?.inputs.map(
        input => input.type,
      );
      console.log(callDataTypes, processedCallData);
      payload.callDatas.push(encodeParameters(callDataTypes || [], processedCallData));
    }
  });

  return payload;
};

export const formatDescription = (description: string) => {
  try {
    return JSON.parse(description);
  } catch (err) {
    const [title, descrip] = description.split('\n');
    return {
      version: 'v1',
      title,
      description: descrip,
    };
  }
};

export default formatProposalPayload;
