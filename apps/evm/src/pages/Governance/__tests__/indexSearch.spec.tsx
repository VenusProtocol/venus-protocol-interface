import type Vi from 'vitest';
import { fireEvent, waitFor } from '@testing-library/dom';

import { ProposalState } from 'types';
import { renderComponent } from 'testUtils/render';
import { useGetProposalPreviews } from 'clients/api';
import { type UseIsFeatureEnabled, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';

import TEST_IDS from '../testIds';
import Governance from '..';

describe('Governance - Feature enabled: governanceSearch', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Vi.Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabled) => name === 'governanceSearch',
    );
  });

  it('renders without crashing', async () => {
    renderComponent(<Governance />);
  });

  it('lets user filter proposals by state', async () => {
    const { getByTestId } = renderComponent(<Governance />);

    // Change proposal state select value
    fireEvent.change(getByTestId(TEST_IDS.proposalStateSelect), {
      target: { value: ProposalState.Executed },
    });

    await waitFor(() =>
      expect(useGetProposalPreviews).toHaveBeenCalledWith({
        page: expect.any(Number),
        limit: expect.any(Number),
        accountAddress: undefined,
        proposalState: ProposalState.Executed,
      }),
    );
  });
});
