import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import _cloneDeep from 'lodash/cloneDeep';
import type Vi from 'vitest';

import fakeAccountAddress, { altAddress } from '__mocks__/models/address';
import fakeContractTransaction from '__mocks__/models/contractTransaction';
import { proposalPreviews } from '__mocks__/models/proposalPreviews';
import { vaults } from '__mocks__/models/vaults';
import { renderComponent } from 'testUtils/render';

import {
  getCurrentVotes,
  getLatestProposalIdByProposer,
  getProposalState,
  setVoteDelegate,
  useGetVestingVaults,
} from 'clients/api';
import CREATE_PROPOSAL_THRESHOLD_MANTISSA from 'constants/createProposalThresholdMantissa';
import { routes } from 'constants/routing';
import { type UseIsFeatureEnabled, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { en } from 'libs/translations';
import { CHAIN_ID_SEARCH_PARAM } from 'libs/wallet/constants';
import { ChainId } from 'types';

import Governance from '..';
import GOVERNANCE_PROPOSAL_TEST_IDS from '../ProposalList/GovernanceProposal/testIds';
import VOTING_WALLET_TEST_IDS from '../VotingWallet/testIds';
import TEST_IDS from '../testIds';

const fakeUserVotingWeight = CREATE_PROPOSAL_THRESHOLD_MANTISSA;

describe('Governance', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Vi.Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabled) => name === 'voteProposal' || name === 'createProposal',
    );
    (setVoteDelegate as Vi.Mock).mockImplementation(() => fakeContractTransaction);
    (getLatestProposalIdByProposer as Vi.Mock).mockImplementation(() => '1');

    (getCurrentVotes as Vi.Mock).mockImplementation(() => ({
      votesMantissa: fakeUserVotingWeight,
    }));
  });

  it('renders without crashing', async () => {
    renderComponent(<Governance />);
  });

  it('opens create proposal modal when clicking text if user has enough voting weight', async () => {
    (getProposalState as Vi.Mock).mockImplementation(async () => ({ state: 2 }));
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
    (getProposalState as Vi.Mock).mockImplementation(async () => ({ state: '0' }));
    const { getByText } = renderComponent(<Governance />);
    const createProposalButton = getByText(en.vote.createProposalPlus).closest('button');

    expect(createProposalButton).toBeDisabled();
  });

  it('create proposal is disabled if active proposal', async () => {
    (getProposalState as Vi.Mock).mockImplementation(async () => ({ state: '1' }));
    const { getByText } = renderComponent(<Governance />);
    const createProposalButton = getByText(en.vote.createProposalPlus).closest('button');

    expect(createProposalButton).toBeDisabled();
  });

  it('opens delegate modal when clicking text with connect wallet button when unauthenticated', async () => {
    const { getByText, getAllByText, getByTestId } = renderComponent(<Governance />);
    const delegateVoteText = getByTestId(VOTING_WALLET_TEST_IDS.delegateYourVoting);

    fireEvent.click(delegateVoteText);
    await waitFor(() => getByText(en.vote.delegateAddress));

    expect(getAllByText(en.connectWallet.connectButton)).toHaveLength(2);
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
      `${routes.vaults.path}?${CHAIN_ID_SEARCH_PARAM}=${ChainId.BSC_TESTNET}`,
    );
  });

  it('prompts user to connect Wallet', async () => {
    (getCurrentVotes as Vi.Mock).mockImplementationOnce(() => ({
      votesMantissa: new BigNumber(0),
    }));

    const { getByText } = renderComponent(<Governance />);
    getByText(en.connectWallet.connectButton);
  });

  it('prompts user to deposit XVS', async () => {
    const vaultsCopy = _cloneDeep(vaults);
    vaultsCopy[1].userStakedMantissa = new BigNumber(0);
    (getCurrentVotes as Vi.Mock).mockImplementationOnce(() => ({
      votesMantissa: new BigNumber(0),
    }));
    (useGetVestingVaults as Vi.Mock).mockImplementationOnce(() => ({
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
      `${routes.vaults.path}?${CHAIN_ID_SEARCH_PARAM}=${ChainId.BSC_TESTNET}`,
    );
  });

  it('successfully delegates to other address', async () => {
    (useGetVestingVaults as Vi.Mock).mockImplementation(() => ({
      data: vaults,
      isLoading: false,
    }));

    const { getByText, getByTestId, getByPlaceholderText } = renderComponent(<Governance />, {
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() =>
      expect(getByTestId(VOTING_WALLET_TEST_IDS.votingWeightValue)).toHaveTextContent('300.00K'),
    );
    await waitFor(() =>
      expect(getByTestId(VOTING_WALLET_TEST_IDS.totalLockedValue)).toHaveTextContent('233'),
    );

    const delegateVoteText = getByTestId(VOTING_WALLET_TEST_IDS.delegateYourVoting);

    fireEvent.click(delegateVoteText);

    await waitFor(() => getByText(en.vote.delegateAddress));

    const addressInput = getByPlaceholderText(en.vote.enterContactAddress);

    fireEvent.change(addressInput, {
      target: { value: altAddress },
    });

    const delegateVotesButton = getByText(en.vote.delegateVotes);
    await waitFor(() => expect(delegateVotesButton).toBeEnabled());
    fireEvent.click(delegateVotesButton);

    await waitFor(() =>
      expect(setVoteDelegate).toBeCalledWith({
        delegateAddress: altAddress,
      }),
    );
  });

  it('successfully delegates to me', async () => {
    (useGetVestingVaults as Vi.Mock).mockImplementation(() => ({
      data: vaults,
      isLoading: false,
    }));

    const { getByText, getByTestId } = renderComponent(<Governance />, {
      accountAddress: fakeAccountAddress,
    });
    const delegateVoteText = getByTestId(VOTING_WALLET_TEST_IDS.delegateYourVoting);

    fireEvent.click(delegateVoteText);

    await waitFor(() => getByText(en.vote.delegateAddress));

    fireEvent.click(getByText(en.vote.pasteYourAddress));

    const delegateVotesButton = getByText(en.vote.delegateVotes);
    await waitFor(() => expect(delegateVotesButton).toBeEnabled());
    fireEvent.click(delegateVotesButton);

    await waitFor(() =>
      expect(setVoteDelegate).toBeCalledWith({
        delegateAddress: fakeAccountAddress,
      }),
    );
  });

  it('proposals navigate to details', async () => {
    const { getAllByTestId } = renderComponent(<Governance />);
    const firstProposalId = proposalPreviews[0].proposalId.toString();

    // Getting all because the cards are rendered twice (once for mobile and once for larger screens)
    const firstProposalAnchor = await waitFor(async () =>
      getAllByTestId(GOVERNANCE_PROPOSAL_TEST_IDS.governanceProposal(firstProposalId)),
    );

    expect(firstProposalAnchor[0].firstChild).toHaveAttribute(
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
    (useIsFeatureEnabled as Vi.Mock).mockImplementation(() => false);
    const { queryAllByTestId } = renderComponent(<Governance />, {
      routerInitialEntries: ['/governance/proposal-create', '/governance'],
      routePath: '/governance/*',
    });
    expect(queryAllByTestId(TEST_IDS.createProposal)).toHaveLength(0);
  });

  it('does not render the voting disabled warning when voting is enabled', async () => {
    const { queryAllByTestId } = renderComponent(<Governance />, {
      accountAddress: fakeAccountAddress,
      routerInitialEntries: ['/governance/proposal-create', '/governance'],
      routePath: '/governance/*',
    });
    expect(queryAllByTestId(VOTING_WALLET_TEST_IDS.votingDisabledWarning)).toHaveLength(0);
  });

  it('renders the voting disabled warning when voting is disabled', async () => {
    (useIsFeatureEnabled as Vi.Mock).mockImplementation(() => false);
    const { getByTestId } = renderComponent(<Governance />, {
      routerInitialEntries: ['/governance/proposal-create', '/governance'],
      routePath: '/governance/*',
    });
    expect(getByTestId(VOTING_WALLET_TEST_IDS.votingDisabledWarning)).toBeVisible();
  });

  it('does not render the delegate section when voting is disabled', async () => {
    (useIsFeatureEnabled as Vi.Mock).mockImplementation(() => false);
    const { queryAllByTestId } = renderComponent(<Governance />, {
      routerInitialEntries: ['/governance/proposal-create', '/governance'],
      routePath: '/governance/*',
    });
    expect(queryAllByTestId(VOTING_WALLET_TEST_IDS.delegateYourVoting)).toHaveLength(0);
  });

  it('renders the delegate/redelegate button when voting is enabled', async () => {
    const vaultsCopy = _cloneDeep(vaults);
    vaultsCopy[1].userStakedMantissa = new BigNumber(1000);
    (useGetVestingVaults as Vi.Mock).mockImplementation(() => ({
      data: vaultsCopy,
      isLoading: false,
    }));
    const { getByTestId } = renderComponent(<Governance />, {
      accountAddress: fakeAccountAddress,
      routerInitialEntries: ['/governance/proposal-create', '/governance'],
      routePath: '/governance/*',
    });
    expect(await waitFor(() => getByTestId(VOTING_WALLET_TEST_IDS.delegateButton))).toBeVisible();
  });

  it('does not render the delegate/redelegate button when voting is disabled', async () => {
    (useIsFeatureEnabled as Vi.Mock).mockImplementation(() => false);
    const { queryAllByTestId } = renderComponent(<Governance />, {
      routerInitialEntries: ['/governance/proposal-create', '/governance'],
      routePath: '/governance/*',
    });
    expect(queryAllByTestId(VOTING_WALLET_TEST_IDS.delegateButton)).toHaveLength(0);
  });
});
