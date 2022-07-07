import React from 'react';
import BigNumber from 'bignumber.js';
import { cloneDeep } from 'lodash';
import { act } from 'react-dom/test-utils';
import { waitFor, fireEvent, within, Matcher, MatcherOptions } from '@testing-library/react';
import renderComponent from 'testUtils/renderComponent';
import fakeAddress from '__mocks__/models/address';
import proposals from '__mocks__/models/proposals';
import voters from '__mocks__/models/voters';
import {
  getProposal,
  getCurrentVotes,
  useGetVoters,
  getVoteReceipt,
  cancelProposal,
  queueProposal,
  executeProposal,
} from 'clients/api';
import CREATE_PROPOSAL_THRESHOLD_WEI from 'constants/createProposalThresholdWei';
import useVote from 'hooks/useVote';
import en from 'translation/translations/en.json';
import Proposal from '.';
import TEST_IDS from './testIds';

jest.mock('clients/api');
jest.mock('hooks/useVote');

const activeProposal = proposals[1];
const cancelledProposal = proposals[3];
const succeededProposal = proposals[4];
const queuedProposal = proposals[5];

const checkAllButtons = async (
  getByTestId: (id: Matcher, options?: MatcherOptions | undefined) => HTMLElement,
  check: (element: HTMLElement) => void,
) => {
  [TEST_IDS.voteSummary.for, TEST_IDS.voteSummary.against, TEST_IDS.voteSummary.abstain].forEach(
    async testId => {
      const voteButton = await waitFor(async () => within(getByTestId(testId)).getByRole('button'));
      check(voteButton);
    },
  );
};

describe('pages/Proposal', () => {
  beforeEach(() => {
    jest
      .useFakeTimers('modern')
      .setSystemTime(activeProposal.endDate.setMinutes(activeProposal.endDate.getMinutes() - 5));

    (getProposal as jest.Mock).mockImplementation(() => activeProposal);

    (useVote as jest.Mock).mockImplementation(() => ({
      vote: jest.fn(),
      isLoading: false,
    }));

    (getCurrentVotes as jest.Mock).mockImplementation(() => new BigNumber(100000000000000000));
  });

  it('renders without crashing', async () => {
    renderComponent(<Proposal />);
  });

  it('vote buttons are disabled when wallet is not connected', async () => {
    const { getByTestId } = renderComponent(<Proposal />);
    checkAllButtons(getByTestId, (element: HTMLElement) => expect(element).toBeDisabled());
  });

  it('vote buttons are disabled when proposal is not active', async () => {
    (getProposal as jest.Mock).mockImplementationOnce(() => cancelledProposal);
    const { getByTestId } = renderComponent(<Proposal />, {
      authContextValue: {
        account: {
          address: fakeAddress,
        },
      },
    });
    checkAllButtons(getByTestId, (element: HTMLElement) => expect(element).toBeDisabled());
  });

  it('vote buttons are disabled when vote is cast', async () => {
    (getVoteReceipt as jest.Mock).mockImplementationOnce(() => ({
      hasVoted: true,
      vote: 'for',
    }));
    const { getByTestId } = renderComponent(<Proposal />, {
      authContextValue: {
        account: {
          address: fakeAddress,
        },
      },
    });
    checkAllButtons(getByTestId, (element: HTMLElement) => expect(element).toBeDisabled());
  });

  it('vote buttons are disabled when voting Weight is 0', async () => {
    (getCurrentVotes as jest.Mock).mockImplementation(() => new BigNumber(0));
    const { getByTestId } = renderComponent(<Proposal />, {
      authContextValue: {
        account: {
          address: fakeAddress,
        },
      },
    });
    checkAllButtons(getByTestId, (element: HTMLElement) => expect(element).toBeDisabled());
  });

  it('vote buttons are enabled when requirements are met', async () => {
    const { getByTestId } = renderComponent(<Proposal />, {
      authContextValue: {
        account: {
          address: fakeAddress,
        },
      },
    });
    checkAllButtons(getByTestId, (element: HTMLElement) => expect(element).toBeEnabled());
  });

  it('allows user to vote for', async () => {
    const vote = jest.fn();
    (useVote as jest.Mock).mockImplementation(() => ({
      vote,
      isLoading: false,
    }));
    const { getByTestId, getByLabelText } = renderComponent(<Proposal />, {
      authContextValue: {
        account: {
          address: fakeAddress,
        },
      },
    });

    const voteButton = await waitFor(async () =>
      within(getByTestId(TEST_IDS.voteSummary.for)).getByRole('button'),
    );
    act(() => {
      fireEvent.click(voteButton);
    });

    const votingPower = await waitFor(async () => getByLabelText(en.vote.votingPower));
    expect(votingPower).toHaveValue('0.1');

    const castButton = await waitFor(async () => getByTestId(TEST_IDS.voteModal.submitButton));
    expect(castButton).toBeEnabled();
    act(() => {
      fireEvent.click(castButton);
    });
    waitFor(() => expect(vote).toBeCalledWith({ proposalId: 97, voteReason: '', voteType: 1 }));
  });

  it('allows user to vote against with reason', async () => {
    const vote = jest.fn();
    (useVote as jest.Mock).mockImplementation(() => ({
      vote,
      isLoading: false,
    }));
    const comment = 'Not a good idea';
    const { getByTestId, getByLabelText } = renderComponent(<Proposal />, {
      authContextValue: {
        account: {
          address: fakeAddress,
        },
      },
    });

    const voteButton = await waitFor(async () =>
      within(getByTestId(TEST_IDS.voteSummary.against)).getByRole('button'),
    );
    act(() => {
      fireEvent.click(voteButton);
    });

    const votingPower = await waitFor(async () => getByLabelText(en.vote.votingPower));
    expect(votingPower).toHaveValue('0.1');

    const commentInput = await waitFor(async () => getByLabelText(en.vote.comment));
    fireEvent.change(commentInput, { target: { value: comment } });

    const castButton = await waitFor(async () => getByTestId(TEST_IDS.voteModal.submitButton));
    expect(castButton).toBeEnabled();
    act(() => {
      fireEvent.click(castButton);
    });
    await waitFor(() =>
      expect(vote).toBeCalledWith({ proposalId: 97, voteReason: comment, voteType: 0 }),
    );
  });

  it('allows user to vote abstain', async () => {
    const vote = jest.fn();
    (useVote as jest.Mock).mockImplementation(() => ({
      vote,
      isLoading: false,
    }));

    const { getByTestId, getByLabelText } = renderComponent(<Proposal />, {
      authContextValue: {
        account: {
          address: fakeAddress,
        },
      },
    });

    const voteButton = await waitFor(async () =>
      within(getByTestId(TEST_IDS.voteSummary.abstain)).getByRole('button'),
    );
    act(() => {
      fireEvent.click(voteButton);
    });

    const votingPower = await waitFor(async () => getByLabelText(en.vote.votingPower));
    expect(votingPower).toHaveValue('0.1');

    const castButton = await waitFor(async () => getByTestId(TEST_IDS.voteModal.submitButton));
    expect(castButton).toBeEnabled();
    act(() => {
      fireEvent.click(castButton);
    });
    await waitFor(() =>
      expect(vote).toBeCalledWith({ proposalId: 97, voteReason: '', voteType: 2 }),
    );
  });

  it('lists votes cast', async () => {
    (useGetVoters as jest.Mock).mockImplementation(({ filter }: { filter: 0 | 1 | 2 }) => {
      const votersCopy = cloneDeep(voters);
      votersCopy.result = [votersCopy.result[filter]];
      return { data: votersCopy, isLoading: false };
    });
    const { getByTestId } = renderComponent(<Proposal />, {
      authContextValue: {
        account: {
          address: fakeAddress,
        },
      },
    });
    const againstVoteSummary = await waitFor(async () =>
      within(getByTestId(TEST_IDS.voteSummary.against)),
    );
    againstVoteSummary.getByText(voters.result[0].address);

    const forVoteSummary = await waitFor(async () => within(getByTestId(TEST_IDS.voteSummary.for)));
    forVoteSummary.getByText(voters.result[1].address);

    const abstainVoteSummary = await waitFor(async () =>
      within(getByTestId(TEST_IDS.voteSummary.abstain)),
    );
    abstainVoteSummary.getByText(voters.result[2].address);
  });

  it('allows user with enough voting weight to cancel', async () => {
    (getCurrentVotes as jest.Mock).mockImplementation(
      () => new BigNumber(CREATE_PROPOSAL_THRESHOLD_WEI),
    );
    const { getByText } = renderComponent(<Proposal />, {
      authContextValue: {
        account: {
          address: fakeAddress,
        },
      },
    });

    const cancelButton = await waitFor(
      async () => getByText(en.voteProposalUi.cancel).closest('button') as HTMLButtonElement,
    );

    act(() => {
      fireEvent.click(cancelButton);
    });
    await waitFor(() => expect(cancelButton).toBeEnabled());
    expect(cancelProposal).toBeCalledWith({ accountAddress: fakeAddress, proposalId: 97 });
  });

  it('user with not enough voting weight cannot cancel', async () => {
    (getCurrentVotes as jest.Mock).mockImplementation(() => new BigNumber(0));
    const { getByTestId } = renderComponent(<Proposal />, {
      authContextValue: {
        account: {
          address: fakeAddress,
        },
      },
    });
    const cancelButton = await waitFor(async () =>
      getByTestId(TEST_IDS.proposalSummary.cancelButton),
    );
    expect(cancelButton).toBeDisabled();
  });

  it('user can queue succeeded proposal', async () => {
    (getProposal as jest.Mock).mockImplementationOnce(() => succeededProposal);
    const { getByTestId } = renderComponent(<Proposal />, {
      authContextValue: {
        account: {
          address: fakeAddress,
        },
      },
    });
    const queueButton = await waitFor(async () =>
      getByTestId(TEST_IDS.proposalSummary.queueButton),
    );
    act(() => {
      fireEvent.click(queueButton);
    });
    await waitFor(() =>
      expect(queueProposal).toBeCalledWith({ accountAddress: fakeAddress, proposalId: 95 }),
    );
  });

  it('user can execute queueded proposal', async () => {
    (getProposal as jest.Mock).mockImplementationOnce(() => queuedProposal);
    const { getByTestId } = renderComponent(<Proposal />, {
      authContextValue: {
        account: {
          address: fakeAddress,
        },
      },
    });
    const executeButton = await waitFor(async () =>
      getByTestId(TEST_IDS.proposalSummary.executeButton),
    );
    act(() => {
      fireEvent.click(executeButton);
    });
    await waitFor(() =>
      expect(executeProposal).toBeCalledWith({ accountAddress: fakeAddress, proposalId: 98 }),
    );
  });
});
