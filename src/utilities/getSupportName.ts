import { VoteSupport } from 'types';

// support value for voter (0 against, 1 for, 2 abstain)
const getSupportName = (support: 0 | 1 | 2): VoteSupport =>
  ['AGAINST' as const, 'FOR' as const, 'ABSTAIN' as const][support];

export default getSupportName;
