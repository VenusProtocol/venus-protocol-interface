import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import renderComponent from 'testUtils/renderComponent';
import fakeAddress from '__mocks__/models/address';
import en from 'translation/translations/en.json';
import CreateProposalModal from '.';

jest.mock('clients/api');

const fakeSignature = 'Comptroller._setAbc(string, bool)';

describe('pages/Proposal/CreateProposalModal', () => {
  it('renders open without crashing', async () => {
    renderComponent(
      <CreateProposalModal isOpen handleClose={jest.fn()} createProposal={jest.fn} />,
    );
  });

  it('renders closed without crashing', async () => {
    renderComponent(
      <CreateProposalModal isOpen={false} handleClose={jest.fn()} createProposal={jest.fn} />,
    );
  });

  it('renders initial with one field', async () => {
    const { getAllByPlaceholderText } = renderComponent(
      <CreateProposalModal isOpen handleClose={jest.fn()} createProposal={jest.fn} />,
    );
    const addressInputs = await waitFor(() =>
      getAllByPlaceholderText(en.vote.createProposalForm.address),
    );
    expect(addressInputs.length).toBe(1);

    const signatureInputs = await waitFor(() =>
      getAllByPlaceholderText(en.vote.createProposalForm.signature),
    );
    expect(signatureInputs.length).toBe(1);
  });

  it('Action Acccordion adds more fields when clicking button', async () => {
    const { getAllByPlaceholderText, getByText } = renderComponent(
      <CreateProposalModal isOpen handleClose={jest.fn()} createProposal={jest.fn} />,
    );
    const addActionButton = getByText(en.vote.createProposalForm.addOneMoreAction);
    fireEvent.click(addActionButton);

    const addressInputs = await waitFor(() =>
      getAllByPlaceholderText(en.vote.createProposalForm.address),
    );
    expect(addressInputs?.length).toBe(2);

    const signatureInputs = await waitFor(() =>
      getAllByPlaceholderText(en.vote.createProposalForm.signature),
    );
    expect(signatureInputs?.length).toBe(2);
  });

  it('Adding action button is disabled while actions are invalid', async () => {
    const { getAllByPlaceholderText, getByText } = renderComponent(
      <CreateProposalModal isOpen handleClose={jest.fn()} createProposal={jest.fn} />,
    );
    const addActionButton = getByText(en.vote.createProposalForm.addOneMoreAction).closest(
      'button',
    ) as HTMLButtonElement;
    await waitFor(() => expect(addActionButton).toBeDisabled());

    let addressInputs = await waitFor(() =>
      getAllByPlaceholderText(en.vote.createProposalForm.address),
    );
    let signatureInputs = await waitFor(() =>
      getAllByPlaceholderText(en.vote.createProposalForm.signature),
    );

    fireEvent.change(addressInputs[0], { target: { value: fakeAddress } });
    fireEvent.change(signatureInputs[0], { target: { value: fakeSignature } });
    await waitFor(() => expect(addActionButton).toBeEnabled());
    act(async () => {
      fireEvent.change(signatureInputs[0], { target: { value: 'bad Address' } });
      await waitFor(() => expect(addActionButton).toBeDisabled());
    });

    fireEvent.change(signatureInputs[0], { target: { value: fakeSignature } });
    fireEvent.click(addActionButton);

    addressInputs = await waitFor(() =>
      getAllByPlaceholderText(en.vote.createProposalForm.address),
    );
    signatureInputs = await waitFor(() =>
      getAllByPlaceholderText(en.vote.createProposalForm.signature),
    );

    fireEvent.change(addressInputs[1], { target: { value: fakeAddress } });
    fireEvent.change(signatureInputs[1], { target: { value: fakeSignature } });

    await waitFor(() => expect(addActionButton).toBeEnabled());
    act(async () => {
      fireEvent.change(signatureInputs[1], { target: { value: undefined } });
      await waitFor(() => expect(addActionButton).toDisabled());
    });
  });

  it('Sets signature as accordion title', async () => {
    const { getAllByPlaceholderText, getByText } = renderComponent(
      <CreateProposalModal isOpen handleClose={jest.fn()} createProposal={jest.fn} />,
    );
    const addActionButton = getByText(en.vote.createProposalForm.addOneMoreAction).closest(
      'button',
    ) as HTMLButtonElement;

    const addressInputs = await waitFor(() =>
      getAllByPlaceholderText(en.vote.createProposalForm.address),
    );
    const signatureInputs = await waitFor(() =>
      getAllByPlaceholderText(en.vote.createProposalForm.signature),
    );

    fireEvent.change(addressInputs[0], { target: { value: fakeAddress } });
    fireEvent.change(signatureInputs[0], { target: { value: fakeSignature } });
    await waitFor(() => expect(addActionButton).toBeEnabled());
    act(async () => {
      fireEvent.click(addActionButton);
      await waitFor(() => getByText(fakeSignature).closest('p'));
    });
  });

  it('Adds calldata fields with correctly formatted signature', async () => {
    const { getAllByPlaceholderText, getByPlaceholderText } = renderComponent(
      <CreateProposalModal isOpen handleClose={jest.fn()} createProposal={jest.fn} />,
    );

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
    const { getAllByPlaceholderText, getByText } = renderComponent(
      <CreateProposalModal isOpen handleClose={jest.fn()} createProposal={jest.fn} />,
    );

    const addActionButton = getByText(en.vote.createProposalForm.addOneMoreAction).closest(
      'button',
    ) as HTMLButtonElement;

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
