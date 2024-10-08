import { screen, waitFor } from '@testing-library/dom';
import type Vi from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { proposals } from '__mocks__/models/proposals';
import { type UseIsFeatureEnabled, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { renderComponent } from 'testUtils/render';
import Governance from '..';
import GOVERNANCE_PROPOSAL_TEST_IDS from '../ProposalList/GovernanceProposal/testIds';
import TEST_IDS from '../testIds';

describe('Governance', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Vi.Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabled) =>
        name === 'voteProposal' || name === 'createProposal' || name === 'multichainGovernance',
    );
  });

  it('renders without crashing', async () => {
    renderComponent(<Governance />);
  });

  it('displays proposals with unexecuted payloads correctly', async () => {
    renderComponent(<Governance />, {
      accountAddress: fakeAccountAddress,
    });

    // Wait for list to be displayed
    const firstProposalId = proposals[0].proposalId.toString();
    await waitFor(async () =>
      screen.getByTestId(GOVERNANCE_PROPOSAL_TEST_IDS.governanceProposal(firstProposalId)),
    );

    expect(screen.getByTestId(TEST_IDS.proposalList).textContent).toMatchSnapshot();
  });
});
