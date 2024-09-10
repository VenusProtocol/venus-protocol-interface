import { fireEvent, screen, waitFor } from '@testing-library/react';
import { proposals as fakeProposals } from '__mocks__/models/proposals';
import { CHAIN_METADATA } from 'constants/chainMetadata';
import { en } from 'libs/translations';
import { useSwitchChain } from 'libs/wallet';
import { renderComponent } from 'testUtils/render';
import type { Proposal } from 'types';
import type Vi from 'vitest';
import { Commands } from '..';
import TEST_IDS from '../../testIds';

const fakeProposal = fakeProposals[0];

describe('Commands', () => {
  it('renders without crashing', () => {
    renderComponent(<Commands proposal={fakeProposal} />);
  });

  it('displays the correct count of executed payloads', () => {
    renderComponent(<Commands proposal={fakeProposal} />);

    const executedCommandsCount = fakeProposal.remoteProposals.filter(
      command => !!command.executedDate,
    ).length;

    expect(
      screen.getByText(`${executedCommandsCount}/${fakeProposal.remoteProposals.length + 1}`),
    ).toBeInTheDocument();
  });

  it('displays the correct number of commands', () => {
    renderComponent(<Commands proposal={fakeProposal} />);

    expect(screen.getAllByTestId(TEST_IDS.command).length).toBe(
      fakeProposal.remoteProposals.length,
    );
  });

  it('displays the right information for each command', () => {
    renderComponent(<Commands proposal={fakeProposal} />);

    const commands = screen.getAllByTestId(TEST_IDS.command);
    commands.forEach(command => expect(command.textContent).toMatchSnapshot());
  });

  it('lets user switch chain if command is executable and connected wallet is on the wrong chain and command', async () => {
    const switchChainMock = vi.fn();
    (useSwitchChain as Vi.Mock).mockImplementation(() => ({
      switchChain: switchChainMock,
    }));

    const customFakeProposal: Proposal = {
      ...fakeProposal,
      remoteProposals: [fakeProposal.remoteProposals[3]],
    };
    const fakeExecutableCommand = fakeProposal.remoteProposals[3];

    renderComponent(<Commands proposal={customFakeProposal} />);

    // Check warning message is displayed
    expect(
      screen.getByText(
        en.voteProposalUi.command.description.wrongChain.replace(
          '{{chainName}}',
          CHAIN_METADATA[fakeExecutableCommand.chainId].name,
        ),
      ),
    ).toBeInTheDocument();

    // Click on switch chain button
    const switchChainButton = screen.getAllByText(
      en.voteProposalUi.command.cta.wrongChain.replace(
        '{{chainName}}',
        CHAIN_METADATA[fakeExecutableCommand.chainId].name,
      ),
    )[0];

    fireEvent.click(switchChainButton);

    await waitFor(() => expect(switchChainMock).toHaveBeenCalledTimes(1));
    expect(switchChainMock).toHaveBeenCalledWith({ chainId: fakeExecutableCommand.chainId });
  });

  // TODO: add more tests (see VEN-2701)
});
