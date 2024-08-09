import { screen } from '@testing-library/react';
import proposals from '__mocks__/models/proposals';
import { useGetProposal } from 'clients/api';
import { type UseIsFeatureEnabled, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type Vi from 'vitest';
import Proposal from '..';

vi.mock('hooks/useVote');
vi.mock('hooks/useIsFeatureEnabled');

const activeProposal = proposals[1];

describe('Proposal page - Feature enabled: multichainGovernance', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(
      activeProposal.endDate!.setMinutes(activeProposal.endDate!.getMinutes() - 5),
    );

    (useGetProposal as Vi.Mock).mockImplementation(() => ({
      data: activeProposal,
    }));

    (useIsFeatureEnabled as Vi.Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabled) => name === 'multichainGovernance',
    );
  });

  it('renders without crashing', async () => {
    renderComponent(<Proposal />);
  });

  it('renders commands block', async () => {
    renderComponent(<Proposal />);

    expect(screen.getByText(en.voteProposalUi.commands.title)).toBeInTheDocument();
  });
});
