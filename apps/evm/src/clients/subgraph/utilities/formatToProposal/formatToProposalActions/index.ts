import type { ProposalAction } from 'types';

// TODO: add tests

export const formatToProposalActions = ({
  callDatas,
  signatures,
  targets,
  values,
}: {
  callDatas: string[];
  signatures: string[];
  targets: string[];
  values: (string | null)[];
}) =>
  callDatas.reduce<ProposalAction[]>((acc, callData, index) => {
    const signature = signatures[index];
    const value = values[index];
    const target = targets[index];

    return callData && signature && value && target
      ? [...acc, { actionIndex: index, signature, value, target, callData }]
      : acc;
  }, []);
