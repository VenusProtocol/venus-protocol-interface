import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import _cloneDeep from 'lodash/cloneDeep';
import React from 'react';
import Vi from 'vitest';

import fakeAccountAddress, { altAddress } from '__mocks__/models/address';
import fakeContractReceipt from '__mocks__/models/contractReceipt';
import proposals from '__mocks__/models/proposals';
import { vaults } from '__mocks__/models/vaults';
import {
  getCurrentVotes,
  getLatestProposalIdByProposer,
  getProposalState,
  getProposals,
  setVoteDelegate,
  useGetVestingVaults,
} from 'clients/api';
import CREATE_PROPOSAL_THRESHOLD_WEI from 'constants/createProposalThresholdWei';
import { routes } from 'constants/routing';
import { TOKENS } from 'constants/tokens';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import Governance from '.';
import GOVERNANCE_PROPOSAL_TEST_IDS from './ProposalList/GovernanceProposal/testIds';
import VOTING_WALLET_TEST_IDS from './VotingWallet/testIds';

vi.mock('hooks/useSuccessfulTransactionModal');

const fakeUserVotingWeight = CREATE_PROPOSAL_THRESHOLD_WEI;

describe('pages/Governance', () => {
  beforeEach(() => {
    (useGetVestingVaults as Vi.Mock).mockImplementation(() => ({
      data: [],
      isLoading: false,
    }));
    (getProposals as Vi.Mock).mockImplementation(() => ({
      proposals,
      limit: 10,
      total: 100,
      offset: 10,
    }));
    (setVoteDelegate as Vi.Mock).mockImplementation(() => fakeContractReceipt);
    (getLatestProposalIdByProposer as Vi.Mock).mockImplementation(() => '1');

    (getCurrentVotes as Vi.Mock).mockImplementation(() => ({
      votesWei: fakeUserVotingWeight,
    }));
  });

  it('renders without crashing', async () => {
    renderComponent(<Governance />);
  });

  it('opens create proposal modal when clicking text if user has enough voting weight', async () => {
    (getProposalState as Vi.Mock).mockImplementation(async () => ({ state: 2 }));
    const { getByText } = renderComponent(<Governance />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
      routerOpts: {
        routerInitialEntries: ['/governance/proposal-create', '/governance'],
        routePath: '/governance/*',
      },
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
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });
    const delegateVoteText = getByTestId(VOTING_WALLET_TEST_IDS.delegateYourVoting);

    fireEvent.click(delegateVoteText);
    await waitFor(() => getByText(en.vote.delegateAddress));

    expect(getByText(en.vote.delegateVotes));
  });

  it('can navigate to vault when clicking deposit tokens', async () => {
    const { getByTestId } = renderComponent(<Governance />);
    const deposityYourTokensText = getByTestId(VOTING_WALLET_TEST_IDS.depositYourTokens);

    expect(deposityYourTokensText).toHaveAttribute('href', routes.vaults.path);
  });

  it('prompts user to connect Wallet', async () => {
    (getCurrentVotes as Vi.Mock).mockImplementationOnce(() => ({ votesWei: new BigNumber(0) }));

    const { getByText } = renderComponent(<Governance />);
    getByText(en.connectWallet.connectButton);
  });

  it('prompts user to deposit XVS', async () => {
    const vaultsCopy = _cloneDeep(vaults);
    vaultsCopy[1].userStakedWei = new BigNumber(0);
    (getCurrentVotes as Vi.Mock).mockImplementationOnce(() => ({ votesWei: new BigNumber(0) }));
    (useGetVestingVaults as Vi.Mock).mockImplementationOnce(() => ({
      data: vaultsCopy,
      isLoading: false,
    }));

    const { getByText, getByTestId } = renderComponent(<Governance />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });
    const depositXvsButton = getByText(en.vote.depositXvs);

    await waitFor(() =>
      expect(getByTestId(VOTING_WALLET_TEST_IDS.votingWeightValue)).toHaveTextContent('0'),
    );
    expect(getByTestId(VOTING_WALLET_TEST_IDS.totalLockedValue)).toHaveTextContent('0');
    expect(depositXvsButton).toHaveAttribute('href', routes.vaults.path);
  });

  it('successfully delegates to other address', async () => {
    (useGetVestingVaults as Vi.Mock).mockImplementation(() => ({
      data: vaults,
      isLoading: false,
    }));

    const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();
    const { getByText, getByTestId, getByPlaceholderText } = renderComponent(<Governance />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
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

    await waitFor(() =>
      expect(openSuccessfulTransactionModal).toHaveBeenCalledWith({
        title: en.vote.successfulDelegationModal.title,
        content: en.vote.successfulDelegationModal.message,
        amount: {
          valueWei: vaults[1].userStakedWei,
          token: TOKENS.xvs,
        },
        transactionHash: fakeContractReceipt.transactionHash,
      }),
    );
  });

  it('successfully delegates to me', async () => {
    (useGetVestingVaults as Vi.Mock).mockImplementation(() => ({
      data: vaults,
      isLoading: false,
    }));

    const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();
    const { getByText, getByTestId } = renderComponent(<Governance />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
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

    await waitFor(() =>
      expect(openSuccessfulTransactionModal).toHaveBeenCalledWith({
        title: en.vote.successfulDelegationModal.title,
        content: en.vote.successfulDelegationModal.message,
        amount: {
          valueWei: vaults[1].userStakedWei,
          token: TOKENS.xvs,
        },
        transactionHash: fakeContractReceipt.transactionHash,
      }),
    );
  });

  it('proposals navigate to details', async () => {
    const { getAllByTestId } = renderComponent(<Governance />);
    // Getting all because the cards are rendered twice (once for mobile and once for larger screens)
    const firstProposalAnchor = await waitFor(async () =>
      getAllByTestId(GOVERNANCE_PROPOSAL_TEST_IDS.governanceProposal('98')),
    );

    expect(firstProposalAnchor[0].firstChild).toHaveAttribute(
      'href',
      routes.governanceProposal.path.replace(':proposalId', '98'),
    );
  });
});
