import { VError } from 'libs/errors';
import type { JsonProposal } from 'types';

const importJsonProposal = async (proposalFile: File) => {
  const contents = await proposalFile.text();
  const jsonProposal = JSON.parse(contents);

  const {
    meta,
    type: proposalType,
    signatures,
    targets,
    params,
    values,
  } = jsonProposal as JsonProposal;

  if (!meta) {
    throw new VError({
      type: 'proposal',
      code: 'noMetaKey',
    });
  }

  const { title, description, abstainDescription, againstDescription, forDescription } = meta;

  if (!title) {
    throw new VError({
      type: 'proposal',
      code: 'missingTitle',
    });
  }

  if (!description) {
    throw new VError({
      type: 'proposal',
      code: 'missingDescription',
    });
  }

  if (!abstainDescription) {
    throw new VError({
      type: 'proposal',
      code: 'missingAbstainDescription',
    });
  }

  if (!againstDescription) {
    throw new VError({
      type: 'proposal',
      code: 'missingAgainstDescription',
    });
  }

  if (!forDescription) {
    throw new VError({
      type: 'proposal',
      code: 'missingForDescription',
    });
  }

  if (proposalType === undefined) {
    throw new VError({
      type: 'proposal',
      code: 'noTypeKey',
    });
  }

  if (!signatures) {
    throw new VError({
      type: 'proposal',
      code: 'noSignaturesKey',
    });
  }

  if (!targets) {
    throw new VError({
      type: 'proposal',
      code: 'noTargetsKey',
    });
  }

  if (!params) {
    throw new VError({
      type: 'proposal',
      code: 'noParamsKey',
    });
  }

  const actions = signatures.map((signature, idx) => {
    const target = targets[idx] ? `${targets[idx]}` : undefined;
    if (!target) {
      throw new VError({
        type: 'proposal',
        code: 'missingTargetForSignature',
        data: {
          info: signature,
        },
      });
    }

    const rawCallData = params[idx] ? params[idx] : undefined;
    if (!rawCallData) {
      throw new VError({
        type: 'proposal',
        code: 'missingParamsForSignature',
        data: {
          info: signature,
        },
      });
    }
    let callData: string[] = [];
    rawCallData.forEach(cd => {
      if (Array.isArray(cd)) {
        const arrStr = JSON.stringify(cd);
        callData = [...callData, arrStr];
      } else {
        callData = [...callData, cd];
      }
    });

    const value = values ? values[idx] : '0';

    return {
      signature: signature ?? '',
      target,
      callData,
      value,
    };
  });

  const formattedProposal = {
    title,
    description,
    forDescription,
    abstainDescription,
    againstDescription,
    proposalType,
    actions,
  };

  return formattedProposal;
};

export default importJsonProposal;
