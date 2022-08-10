import { Matcher, MatcherOptions, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';

import fakeAddress from '__mocks__/models/address';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import CreateProposalModal from '.';

jest.mock('clients/api');

const fakeName = 'Proposal';
const fakeDescription = 'Interesting idea';
const fakeSignature = '_setAbc(string, bool)';
const fakeForOption = 'fakeForOption';
const fakeAgainstOption = 'fakeAgainstOption';
const fakeAbstainOption = 'fakeAbstainOption';

const next = async (nextButton: HTMLElement) => {
  await waitFor(() => expect(nextButton).toBeEnabled());
  fireEvent.click(nextButton);
};

const completeFirstStep = async (
  getByPlaceholderText: (id: Matcher, options?: MatcherOptions | undefined) => HTMLElement,
) => {
  const proposalNameInput = await waitFor(() =>
    // failing
    getByPlaceholderText(en.vote.createProposalForm.proposalName),
  );

  const descriptionInput = await waitFor(() =>
    getByPlaceholderText(en.vote.createProposalForm.addDescription),
  );

  act(async () => {
    fireEvent.change(proposalNameInput, { target: { value: fakeName } });
    fireEvent.change(descriptionInput, { target: { value: fakeDescription } });
  });
};

const completeSecondStep = async (
  getByPlaceholderText: (id: Matcher, options?: MatcherOptions | undefined) => HTMLElement,
) => {
  const forOptionInput = await waitFor(() =>
    // failing
    getByPlaceholderText(en.vote.createProposalForm.forOption),
  );
  const againstOptionInput = await waitFor(() =>
    getByPlaceholderText(en.vote.createProposalForm.againstOption),
  );

  const abstainOptionInput = await waitFor(() =>
    getByPlaceholderText(en.vote.createProposalForm.abstainOption),
  );

  fireEvent.change(forOptionInput, { target: { value: fakeForOption } });
  fireEvent.change(againstOptionInput, { target: { value: fakeAgainstOption } });
  fireEvent.change(abstainOptionInput, { target: { value: fakeAbstainOption } });
};

describe('pages/Proposal/CreateProposalModal', () => {
  it('renders open without crashing', async () => {
    renderComponent(
      <CreateProposalModal
        isOpen
        handleClose={jest.fn()}
        createProposal={jest.fn()}
        isCreateProposalLoading={false}
      />,
    );
  });

  it('renders closed without crashing', async () => {
    renderComponent(
      <CreateProposalModal
        isOpen={false}
        handleClose={jest.fn()}
        createProposal={jest.fn()}
        isCreateProposalLoading={false}
      />,
    );
  });

  it('can enter title and description', async () => {
    const { getByPlaceholderText, getByText } = renderComponent(
      <CreateProposalModal
        isOpen
        handleClose={jest.fn()}
        createProposal={jest.fn()}
        isCreateProposalLoading={false}
      />,
    );
    const nextButton = getByText(en.vote.createProposalForm.nextStep).closest(
      'button',
    ) as HTMLButtonElement;
    await waitFor(() => expect(nextButton).toBeDisabled());
    completeFirstStep(getByPlaceholderText);
    next(nextButton);
  });

  it('Complete vote option descriptions', async () => {
    const { getByPlaceholderText, getByText } = renderComponent(
      <CreateProposalModal
        isOpen
        handleClose={jest.fn()}
        createProposal={jest.fn()}
        isCreateProposalLoading={false}
      />,
    );

    const nextButton = getByText(en.vote.createProposalForm.nextStep).closest(
      'button',
    ) as HTMLButtonElement;
    completeFirstStep(getByPlaceholderText);
    next(nextButton);
    completeSecondStep(getByPlaceholderText);
    next(nextButton);
  });

  it('Action Acccordion adds more fields when clicking button', async () => {
    const { getByPlaceholderText, getByText, getByTestId } = renderComponent(
      <CreateProposalModal
        isOpen
        handleClose={jest.fn()}
        createProposal={jest.fn()}
        isCreateProposalLoading={false}
      />,
    );
    const nextButton = getByText(en.vote.createProposalForm.nextStep).closest(
      'button',
    ) as HTMLButtonElement;

    completeFirstStep(getByPlaceholderText);
    next(nextButton);

    completeSecondStep(getByPlaceholderText);
    next(nextButton);

    const addActionButton = await waitFor(
      () =>
        getByText(en.vote.createProposalForm.addOneMoreAction).closest(
          'button',
        ) as HTMLButtonElement,
    );

    const addressInput0 = await waitFor(() => getByTestId('actions.0.address'));
    const signatureInput0 = await waitFor(() => getByTestId('actions.0.signature'));

    act(async () => {
      fireEvent.change(addressInput0, { target: { value: fakeAddress } });
      fireEvent.change(signatureInput0, { target: { value: fakeSignature } });

      const dataInput0 = await waitFor(() => getByTestId('actions.0.callData.0'));
      const dataInput1 = await waitFor(() => getByTestId('actions.0.callData.1'));

      fireEvent.change(dataInput0, { target: { value: 'root' } });
      fireEvent.change(dataInput1, { target: { value: 'false' } });

      await waitFor(() => expect(addActionButton).toBeEnabled());
      await waitFor(() => fireEvent.click(addActionButton));
    });

    await waitFor(() => getByTestId('actions.1.address'));
    await waitFor(() => getByTestId('actions.1.signature'));
  });

  it('Adding action button is disabled while actions are invalid', async () => {
    const { getByPlaceholderText, getByText, getByTestId } = renderComponent(
      <CreateProposalModal
        isOpen
        handleClose={jest.fn()}
        createProposal={jest.fn()}
        isCreateProposalLoading={false}
      />,
    );
    const nextButton = getByText(en.vote.createProposalForm.nextStep).closest(
      'button',
    ) as HTMLButtonElement;

    completeFirstStep(getByPlaceholderText);
    next(nextButton);

    completeSecondStep(getByPlaceholderText);
    next(nextButton);

    const addActionButton = await waitFor(
      () =>
        getByText(en.vote.createProposalForm.addOneMoreAction).closest(
          'button',
        ) as HTMLButtonElement,
    );

    const addressInput0 = await waitFor(() => getByTestId('actions.0.address'));
    const signatureInput0 = await waitFor(() => getByTestId('actions.0.signature'));

    act(async () => {
      fireEvent.change(addressInput0, { target: { value: fakeAddress } });
      fireEvent.change(signatureInput0, { target: { value: fakeSignature } });

      const dataInput0 = await waitFor(() => getByTestId('actions.0.callData.0'));
      const dataInput1 = await waitFor(() => getByTestId('actions.0.callData.1'));

      fireEvent.change(dataInput0, { target: { value: 'root' } });
      fireEvent.change(dataInput1, { target: { value: 'false' } });

      await waitFor(() => fireEvent.click(addActionButton));
    });

    act(async () => {
      fireEvent.change(signatureInput0, { target: { value: 'bad Address' } });
      await waitFor(() => expect(addActionButton).toBeDisabled());
    });

    fireEvent.change(signatureInput0, { target: { value: fakeSignature } });

    await waitFor(() => expect(addActionButton).toBeEnabled());

    act(async () => {
      fireEvent.change(signatureInput0, { target: { value: undefined } });
      await waitFor(() => expect(addActionButton).toDisabled());
    });
  });

  it('Sets signature as accordion title', async () => {
    const { getByPlaceholderText, getByText, getByTestId } = renderComponent(
      <CreateProposalModal
        isOpen
        handleClose={jest.fn()}
        createProposal={jest.fn()}
        isCreateProposalLoading={false}
      />,
    );
    const nextButton = getByText(en.vote.createProposalForm.nextStep).closest(
      'button',
    ) as HTMLButtonElement;

    completeFirstStep(getByPlaceholderText);
    next(nextButton);

    completeSecondStep(getByPlaceholderText);
    next(nextButton);

    const addActionButton = await waitFor(
      () =>
        getByText(en.vote.createProposalForm.addOneMoreAction).closest(
          'button',
        ) as HTMLButtonElement,
    );

    await waitFor(() => expect(addActionButton).toBeDisabled());

    const addressInput0 = await waitFor(() => getByTestId('actions.0.address'));
    const signatureInput0 = await waitFor(() => getByTestId('actions.0.signature'));

    await act(async () => {
      fireEvent.change(addressInput0, { target: { value: fakeAddress } });
      fireEvent.change(signatureInput0, { target: { value: fakeSignature } });

      const dataInput0 = await waitFor(() => getByTestId('actions.0.callData.0'));
      const dataInput1 = await waitFor(() => getByTestId('actions.0.callData.1'));

      fireEvent.change(dataInput0, { target: { value: 'root' } });
      fireEvent.change(dataInput1, { target: { value: 'false' } });
    });

    await waitFor(() => expect(addActionButton).toBeEnabled()); // failing

    act(async () => {
      fireEvent.click(addActionButton);
      await waitFor(() => getByText(fakeSignature).closest('p'));
    });
  });

  it('Adds callData fields with correctly formatted signature', async () => {
    const { getByText, getAllByPlaceholderText, getByPlaceholderText } = renderComponent(
      <CreateProposalModal
        isOpen
        handleClose={jest.fn()}
        createProposal={jest.fn()}
        isCreateProposalLoading={false}
      />,
    );

    const nextButton = getByText(en.vote.createProposalForm.nextStep).closest(
      'button',
    ) as HTMLButtonElement;

    completeFirstStep(getByPlaceholderText);
    next(nextButton);

    completeSecondStep(getByPlaceholderText);
    next(nextButton);

    const addActionButton = await waitFor(
      () =>
        getByText(en.vote.createProposalForm.addOneMoreAction).closest(
          'button',
        ) as HTMLButtonElement,
    );

    await waitFor(() => expect(addActionButton).toBeDisabled());

    const addressInputs = await waitFor(() =>
      getAllByPlaceholderText(en.vote.createProposalForm.address),
    );
    const signatureInputs = await waitFor(() =>
      getAllByPlaceholderText(en.vote.createProposalForm.signature),
    );

    fireEvent.change(addressInputs[0], { target: { value: fakeAddress } });
    fireEvent.change(signatureInputs[0], { target: { value: fakeSignature } });

    // fake Signature should add an input with a bool placeholder and on with a string placeholder
    getByPlaceholderText('string');
    getByPlaceholderText('bool');
  });

  it('Limits to 10 actions', async () => {
    const { getAllByPlaceholderText, getByText, getByPlaceholderText } = renderComponent(
      <CreateProposalModal
        isOpen
        handleClose={jest.fn()}
        createProposal={jest.fn()}
        isCreateProposalLoading={false}
      />,
    );

    const nextButton = getByText(en.vote.createProposalForm.nextStep).closest(
      'button',
    ) as HTMLButtonElement;

    completeFirstStep(getByPlaceholderText);
    next(nextButton);

    completeSecondStep(getByPlaceholderText);
    next(nextButton);

    const addActionButton = await waitFor(
      () =>
        getByText(en.vote.createProposalForm.addOneMoreAction).closest(
          'button',
        ) as HTMLButtonElement,
    );

    let addressInputs = await waitFor(() =>
      getAllByPlaceholderText(en.vote.createProposalForm.address),
    );
    let signatureInputs = await waitFor(() =>
      getAllByPlaceholderText(en.vote.createProposalForm.signature),
    );
    Array(10).forEach(async (value, idx) => {
      fireEvent.change(addressInputs[0], { target: { value: fakeAddress } });
      fireEvent.change(signatureInputs[0], { target: { value: fakeSignature } });

      fireEvent.click(addActionButton);

      addressInputs = await waitFor(() =>
        getAllByPlaceholderText(en.vote.createProposalForm.address),
      );
      signatureInputs = await waitFor(() =>
        getAllByPlaceholderText(en.vote.createProposalForm.signature),
      );
      expect(addressInputs.length).toBe(idx + 1);
      expect(signatureInputs.length).toBe(idx + 1);
    });

    await waitFor(() => expect(addActionButton).toBeDisabled());
  });
});
