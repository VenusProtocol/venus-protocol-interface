import type { CreateProposalInput } from 'clients/api';

import type { Address } from 'viem';
import encodeCallData from './encodeCallData';
import type { FormValues } from './proposalSchema';

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
    values: [],
    callDatas: [],
    description: JSON.stringify({
      version: 'v2',
      title: data.title,
      description: data.description,
      forDescription: data.forDescription,
      againstDescription: data.againstDescription,
      abstainDescription: data.abstainDescription,
    }),
    proposalType: data.proposalType as 0 | 1 | 2,
  };

  data.actions.forEach(action => {
    payload.targets.push(action.target as Address);
    payload.signatures.push(action.signature);
    payload.values.push(action.value);

    if (action.callData !== undefined) {
      payload.callDatas.push(encodeCallData(action.signature, action.callData));
    }
  });

  return payload;
};

export default formatProposalPayload;
