import type { ProposalAction } from 'types';
import type { ApiProposalAction } from '../../types';

export const formatToProposalActions = ({ actions }: { actions: ApiProposalAction[] }) =>
  actions.reduce<ProposalAction[]>(
    (acc, { calldata, signature, valueMantissa, targetAddress }, index) =>
      calldata && signature && valueMantissa && targetAddress
        ? [
            ...acc,
            {
              actionIndex: index,
              signature,
              value: valueMantissa,
              target: targetAddress,
              callData: calldata,
            },
          ]
        : acc,
    [],
  );
