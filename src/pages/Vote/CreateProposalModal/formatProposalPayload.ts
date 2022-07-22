import { CreateProposalInput } from 'clients/api';

import encodeCallData from './encodeCallData';
import { FormValues } from './proposalSchema';

export interface V1Description {
  version: 'v1';
  title: string;
  description: string;
}

export interface V2Description {
  version: 'v2';
  title: string;
  description: string;
  forDescription: string;
  againstDescription: string;
  abstainDescription: string;
}

const formatProposalPayload = (data: FormValues) => {
  const payload: Omit<CreateProposalInput, 'accountAddress'> = {
    targets: [],
    signatures: [],
    callDatas: [],
    description: JSON.stringify({
      version: 'v2',
      title: data.title,
      description: data.description,
      forDescription: data.forDescription,
      againstDescription: data.againstDescription,
      abstainDescription: data.abstainDescription,
    }),
  };

  data.actions.forEach(action => {
    payload.targets.push(action.target);
    payload.signatures.push(action.signature);
    if (action.data !== undefined) {
      payload.callDatas.push(encodeCallData(action.signature, action.data));
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
