import { print } from 'graphql';

import { ProposalsDocument } from 'clients/subgraph/gql/generated/governanceBsc';

describe('Proposals query document', () => {
  it('asks the total alias for more than The Graph default of 100', () => {
    const document = print(ProposalsDocument);

    expect(document).toContain('total: proposals(first: $totalLimit');
    expect(document).toContain('$totalLimit: Int = 1000');
  });
});
