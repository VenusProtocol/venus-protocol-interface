import { fireEvent, screen, waitFor } from '@testing-library/react';
import { commands as fakeCommands } from '__mocks__/models/proposalCommands';
import { CHAIN_METADATA } from 'constants/chainMetadata';
import { en } from 'libs/translations';
import { useSwitchChain } from 'libs/wallet';
import { renderComponent } from 'testUtils/render';
import type Vi from 'vitest';
import { Commands } from '..';
import TEST_IDS from '../../testIds';

describe('Commands', () => {
  it('renders without crashing', () => {
    renderComponent(<Commands commands={[]} />);
  });

  it('displays the correct count of executed payloads', () => {
    renderComponent(<Commands commands={fakeCommands} />);

    const executedCommandsCount = fakeCommands.filter(command => !!command.executedAt).length;
    expect(screen.getByText(`${executedCommandsCount}/${fakeCommands.length}`)).toBeInTheDocument();
  });

  it('displays the correct number of commands', () => {
    renderComponent(<Commands commands={fakeCommands} />);

    expect(screen.getAllByTestId(TEST_IDS.command).length).toBe(fakeCommands.length);
  });

  it('displays the right information for each command', () => {
    renderComponent(<Commands commands={fakeCommands} />);

    const commands = screen.getAllByTestId(TEST_IDS.command);
    commands.forEach(command => expect(command.textContent).toMatchSnapshot());
  });

  it('lets user switch chain if command is executable and connected wallet is on the wrong chain and command', async () => {
    const switchChainMock = vi.fn();
    (useSwitchChain as Vi.Mock).mockImplementation(() => ({
      switchChain: switchChainMock,
    }));

    const executableCommand = fakeCommands[3];

    renderComponent(<Commands commands={[executableCommand]} />);

    // Check warning message is displayed
    expect(
      screen.getByText(
        en.voteProposalUi.command.description.wrongChain.replace(
          '{{chainName}}',
          CHAIN_METADATA[executableCommand.chainId].name,
        ),
      ),
    ).toBeInTheDocument();

    // Click on switch chain button
    const switchChainButton = screen.getAllByText(
      en.voteProposalUi.command.cta.wrongChain.replace(
        '{{chainName}}',
        CHAIN_METADATA[executableCommand.chainId].name,
      ),
    )[0];

    fireEvent.click(switchChainButton);

    await waitFor(() => expect(switchChainMock).toHaveBeenCalledTimes(1));
    expect(switchChainMock).toHaveBeenCalledWith({ chainId: executableCommand.chainId });
  });

  // TODO: add more tests (see VEN-2701)
});
