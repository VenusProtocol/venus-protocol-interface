import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import _cloneDeep from 'lodash/cloneDeep';
import type { Mock } from 'vitest';

import fakeAccountAddress, { altAddress } from '__mocks__/models/address';
import { proposals } from '__mocks__/models/proposals';
import { vaults } from '__mocks__/models/vaults';
import { renderComponent } from 'testUtils/render';

import {
  getCurrentVotes,
  getLatestProposalIdByProposer,
  getProposalState,
  useGetProposals,
  useGetVestingVaults,
  useSetVoteDelegate,
} from 'clients/api';
import CREATE_PROPOSAL_THRESHOLD_MANTISSA from 'constants/createProposalThresholdMantissa';
import { routes } from 'constants/routing';
import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useNow } from 'hooks/useNow';
import { en } from 'libs/translations';
import { CHAIN_ID_SEARCH_PARAM } from 'libs/wallet';
import { ChainId, ProposalState } from 'types';

import config from 'config';
import Governance from '..';
import GOVERNANCE_PROPOSAL_TEST_IDS from '../ProposalList/GovernanceProposal/testIds';
import VOTING_WALLET_TEST_IDS from '../VotingWallet/testIds';
import TEST_IDS from '../testIds';

vi.mock('hooks/useNow');

const fakeNow = new Date('2023-10-14T16:11:35.000Z');

const fakeUserVotingWeight = CREATE_PROPOSAL_THRESHOLD_MANTISSA;

describe('Governance', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name === 'voteProposal' || name === 'createProposal',
    );
    (getLatestProposalIdByProposer as Mock).mockImplementation(() => '1');

    (getCurrentVotes as Mock).mockImplementation(() => ({
      votesMantissa: fakeUserVotingWeight,
    }));

    (useNow as Mock).mockImplementation(() => fakeNow);
  });

  it('renders without crashing', async () => {
    renderComponent(<Governance />);
  });

  it('displays proposals correctly', async () => {
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

  it('lets user filter proposals by state', async () => {
    const { getByTestId } = renderComponent(<Governance />);

    // Change proposal state select value
    fireEvent.change(getByTestId(TEST_IDS.proposalStateSelect), {
      target: { value: ProposalState.Executed },
    });

    await waitFor(() =>
      expect(useGetProposals).toHaveBeenCalledWith({
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
      expect(useGetProposals).toHaveBeenCalledWith({
        page: expect.any(Number),
        limit: expect.any(Number),
        accountAddress: undefined,
        proposalState: undefined,
        search: fakeSearchInput,
      }),
    );
  });

  it('opens create proposal modal when clicking text if user has enough voting weight', async () => {
    (getProposalState as Mock).mockImplementation(async () => ({ state: 2 }));
    const { getByText } = renderComponent(<Governance />, {
      accountAddress: fakeAccountAddress,
      routerInitialEntries: ['/governance/proposal-create', '/governance'],
      routePath: '/governance/*',
    });
    const createProposalButton = getByText(en.vote.createProposalPlus).closest('button');
    await waitFor(() => expect(createProposalButton).toBeEnabled());
    fireEvent.click(createProposalButton as HTMLButtonElement);

    const createManualProposalButton = getByText(
      en.vote.createProposalModal.createManually,
    ).closest('button');
    await waitFor(() => expect(createManualProposalButton).toBeEnabled());

    const importProposalButton = getByText(en.vote.createProposalModal.uploadFile).closest(
      'button',
    );
    await waitFor(() => expect(importProposalButton).toBeEnabled());
  });

  it('create proposal is disabled if pending proposal', async () => {
    (getProposalState as Mock).mockImplementation(async () => ({ state: '0' }));
    const { getByText } = renderComponent(<Governance />);
    const createProposalButton = getByText(en.vote.createProposalPlus).closest('button');

    expect(createProposalButton).toBeDisabled();
  });

  it('create proposal is disabled if active proposal', async () => {
    (getProposalState as Mock).mockImplementation(async () => ({ state: '1' }));
    const { getByText } = renderComponent(<Governance />);
    const createProposalButton = getByText(en.vote.createProposalPlus).closest('button');

    expect(createProposalButton).toBeDisabled();
  });

  it('opens delegate modal when clicking text with delegate button when authenticated', async () => {
    const { getByText, getByTestId } = renderComponent(<Governance />, {
      accountAddress: fakeAccountAddress,
    });
    const delegateVoteText = getByTestId(VOTING_WALLET_TEST_IDS.delegateYourVoting);

    fireEvent.click(delegateVoteText);
    await waitFor(() => getByText(en.vote.delegateAddress));

    expect(getByText(en.vote.delegateVotes));
  });

  it('can navigate to vault when clicking deposit tokens', async () => {
    const { getByTestId } = renderComponent(<Governance />);
    const deposityYourTokensText = getByTestId(VOTING_WALLET_TEST_IDS.depositYourTokens);

    expect(deposityYourTokensText).toHaveAttribute(
      'href',
      `${routes.staking.path}?${CHAIN_ID_SEARCH_PARAM}=${ChainId.BSC_TESTNET}`,
    );
  });

  it('prompts user to connect Wallet', async () => {
    const { getByText } = renderComponent(<Governance />);
    getByText(en.connectWallet.connectButton);
  });

  it('prompts user to switch chain if they are connected to the wrong one', async () => {
    (getCurrentVotes as Mock).mockImplementationOnce(() => ({
      votesMantissa: new BigNumber(0),
    }));

    const { getByText } = renderComponent(<Governance />);
    getByText(en.connectWallet.connectButton);
  });

  it('prompts user to deposit XVS', async () => {
    const vaultsCopy = _cloneDeep(vaults);
    vaultsCopy[1].userStakedMantissa = new BigNumber(0);
    (getCurrentVotes as Mock).mockImplementationOnce(() => ({
      votesMantissa: new BigNumber(0),
    }));
    (useGetVestingVaults as Mock).mockImplementationOnce(() => ({
      data: vaultsCopy,
      isLoading: false,
    }));

    const { getByText, getByTestId } = renderComponent(<Governance />, {
      accountAddress: fakeAccountAddress,
    });

    const depositXvsButton = await waitFor(() => getByText(en.vote.depositXvs));

    await waitFor(() =>
      expect(getByTestId(VOTING_WALLET_TEST_IDS.votingWeightValue)).toHaveTextContent('0'),
    );
    expect(getByTestId(VOTING_WALLET_TEST_IDS.totalLockedValue)).toHaveTextContent('0');
    expect(depositXvsButton).toHaveAttribute(
      'href',
      `${routes.staking.path}?${CHAIN_ID_SEARCH_PARAM}=${ChainId.BSC_TESTNET}`,
    );
  });

  it('successfully delegates to other address', async () => {
    const mockSetVoteDelegate = vi.fn();
    (useSetVoteDelegate as Mock).mockImplementation(() => ({
      mutateAsync: mockSetVoteDelegate,
    }));

    (useGetVestingVaults as Mock).mockImplementation(() => ({
      data: vaults,
      isLoading: false,
    }));

    const { getByText, getByTestId, getByPlaceholderText } = renderComponent(<Governance />, {
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() =>
      expect(getByTestId(VOTING_WALLET_TEST_IDS.votingWeightValue)).toHaveTextContent('300K'),
    );
    await waitFor(() =>
      expect(getByTestId(VOTING_WALLET_TEST_IDS.totalLockedValue)).toHaveTextContent('233'),
    );

    const delegateVoteText = getByTestId(VOTING_WALLET_TEST_IDS.delegateYourVoting);

    fireEvent.click(delegateVoteText);

    await waitFor(() => getByText(en.vote.delegateAddress));

    const addressInput = getByPlaceholderText(en.vote.enterContactAddress);

    await act(async () => {
      fireEvent.change(addressInput, {
        target: { value: altAddress },
      });
    });

    const delegateVotesButton = getByText(en.vote.delegateVotes);
    await waitFor(() => expect(delegateVotesButton).toBeEnabled());
    fireEvent.click(delegateVotesButton);

    await waitFor(() =>
      expect(mockSetVoteDelegate).toHaveBeenCalledWith({
        delegateAddress: altAddress,
      }),
    );
  });

  it('successfully delegates to me', async () => {
    const mockSetVoteDelegate = vi.fn();
    (useSetVoteDelegate as Mock).mockImplementation(() => ({
      mutateAsync: mockSetVoteDelegate,
    }));

    (useGetVestingVaults as Mock).mockImplementation(() => ({
      data: vaults,
      isLoading: false,
    }));

    const { getByText, getByTestId } = renderComponent(<Governance />, {
      accountAddress: fakeAccountAddress,
    });
    const delegateVoteText = getByTestId(VOTING_WALLET_TEST_IDS.delegateYourVoting);

    fireEvent.click(delegateVoteText);

    await waitFor(() => getByText(en.vote.delegateAddress));

    await act(async () => {
      fireEvent.click(getByText(en.vote.pasteYourAddress));
    });

    const delegateVotesButton = getByText(en.vote.delegateVotes);
    await waitFor(() => expect(delegateVotesButton).toBeEnabled());
    fireEvent.click(delegateVotesButton);

    await waitFor(() =>
      expect(mockSetVoteDelegate).toHaveBeenCalledWith({
        delegateAddress: fakeAccountAddress,
      }),
    );
  });

  it('proposals navigate to details', async () => {
    const { getByTestId } = renderComponent(<Governance />);
    const firstProposalId = proposals[0].proposalId.toString();

    // Getting all because the cards are rendered twice (once for mobile and once for larger screens)
    const firstProposalAnchor = await waitFor(async () =>
      getByTestId(GOVERNANCE_PROPOSAL_TEST_IDS.governanceProposal(firstProposalId)),
    );

    expect(firstProposalAnchor).toHaveAttribute(
      'href',
      `${routes.governanceProposal.path.replace(
        ':proposalId',
        firstProposalId,
      )}?${CHAIN_ID_SEARCH_PARAM}=${ChainId.BSC_TESTNET}`,
    );
  });

  it('shows the create proposal option when its feature flag is enabled', async () => {
    const { queryAllByTestId } = renderComponent(<Governance />, {
      accountAddress: fakeAccountAddress,
      routerInitialEntries: ['/governance/proposal-create', '/governance'],
      routePath: '/governance/*',
    });
    expect(queryAllByTestId(TEST_IDS.createProposal)).toHaveLength(1);
  });

  it('shows the create proposal button when createProposal feature is enabled', async () => {
    const { queryAllByTestId } = renderComponent(<Governance />, {
      accountAddress: fakeAccountAddress,
      routerInitialEntries: ['/governance/proposal-create', '/governance'],
      routePath: '/governance/*',
    });
    expect(queryAllByTestId(TEST_IDS.createProposal)).toHaveLength(1);
  });

  it('hides the create proposal option when its feature flag is disabled', async () => {
    (useIsFeatureEnabled as Mock).mockImplementation(() => false);
    const { queryAllByTestId } = renderComponent(<Governance />, {
      routerInitialEntries: ['/governance/proposal-create', '/governance'],
      routePath: '/governance/*',
    });
    expect(queryAllByTestId(TEST_IDS.createProposal)).toHaveLength(0);
  });

  it('does not render the voting disabled warning when voting is enabled', async () => {
    const { queryAllByTestId } = renderComponent(<Governance />, {
      accountAddress: fakeAccountAddress,
    });
    expect(queryAllByTestId(VOTING_WALLET_TEST_IDS.votingDisabledWarning)).toHaveLength(0);
  });

  it('renders the voting disabled warning when voting is disabled', async () => {
    (useIsFeatureEnabled as Mock).mockImplementation(() => false);
    const { getByTestId } = renderComponent(<Governance />);
    expect(getByTestId(VOTING_WALLET_TEST_IDS.votingDisabledWarning)).toBeVisible();
  });

  it('does not render the delegate section when voting is disabled', async () => {
    (useIsFeatureEnabled as Mock).mockImplementation(() => false);
    const { queryAllByTestId } = renderComponent(<Governance />);
    expect(queryAllByTestId(VOTING_WALLET_TEST_IDS.delegateYourVoting)).toHaveLength(0);
  });

  it('renders the delegate/redelegate button when voting is enabled', async () => {
    const vaultsCopy = _cloneDeep(vaults);
    vaultsCopy[1].userStakedMantissa = new BigNumber(1000);
    (useGetVestingVaults as Mock).mockImplementation(() => ({
      data: vaultsCopy,
      isLoading: false,
    }));
    const { getByTestId } = renderComponent(<Governance />, {
      accountAddress: fakeAccountAddress,
    });
    expect(await waitFor(() => getByTestId(VOTING_WALLET_TEST_IDS.delegateButton))).toBeVisible();
  });

  it('does not render the delegate/redelegate button when voting is disabled', async () => {
    (useIsFeatureEnabled as Mock).mockImplementation(() => false);
    const { queryAllByTestId } = renderComponent(<Governance />, {
      routerInitialEntries: ['/governance/proposal-create', '/governance'],
      routePath: '/governance/*',
    });
    expect(queryAllByTestId(VOTING_WALLET_TEST_IDS.delegateButton)).toHaveLength(0);
  });

  describe('when running in Safe Wallet app', () => {
    beforeEach(() => {
      config.isSafeApp = true;
    });

    afterEach(() => {
      config.isSafeApp = false;
    });

    it('renders warning about voting being disabled but does not show switch button when running in Safe Wallet app', async () => {
      (useIsFeatureEnabled as Mock).mockImplementation(() => false);

      const { getByTestId } = renderComponent(<Governance />, {
        accountAddress: fakeAccountAddress,
        chainId: ChainId.ARBITRUM_SEPOLIA,
      });

      expect(getByTestId(VOTING_WALLET_TEST_IDS.votingDisabledWarning)).toBeVisible();
      expect(screen.queryByText(en.vote.omnichain.switchToBnb)).not.toBeInTheDocument();
    });
  });
});
