import { formatToProposal } from 'utilities';

import proposalResponse from '../api/proposals.json';
import fakeAddress from './address';

const proposals = proposalResponse.result.map(p =>
  formatToProposal({ ...p, accountAddress: fakeAddress }),
);

export default proposals;
