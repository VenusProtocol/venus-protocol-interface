import { fireEvent, waitFor } from '@testing-library/dom';
import type Vi from 'vitest';

import { useGetProposalPreviews } from 'clients/api';
import { type UseIsFeatureEnabled, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import { ProposalState } from 'types';

import Governance from '..';
import TEST_IDS from '../testIds';

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
        search: '',
        proposalState: ProposalState.Executed,
      }),
    );
  });

  it('lets user search proposals by text', async () => {
    const { getByPlaceholderText } = renderComponent(<Governance />);

    const fakeSearchInput = 'fake search';

    // Change proposal state select value
    fireEvent.change(getByPlaceholderText(en.vote.searchInput.placeholder), {
      target: { value: fakeSearchInput },
    });

    await waitFor(() =>
      expect(useGetProposalPreviews).toHaveBeenCalledWith({
        page: expect.any(Number),
        limit: expect.any(Number),
        accountAddress: undefined,
        proposalState: undefined,
        search: fakeSearchInput,
      }),
    );
  });
});
