import { Matcher, MatcherOptions, fireEvent, waitFor } from '@testing-library/react';
import { displayMutationError } from 'packages/errors';
import { en } from 'packages/translations';
import React from 'react';
import Vi from 'vitest';

import fakeAddress from '__mocks__/models/address';
import TEST_VIP from 'assets/proposals/vip-123.json';
import { routes } from 'constants/routing';
import { renderComponent } from 'testUtils/render';

import CreateProposalModal from '.';
import TEST_IDS from './testIds';

const fakeName = 'Proposal';
const fakeDescription = 'Interesting idea';
const fakeSignature = '_setAbc(string, bool)';
const fakeForOption = 'fakeForOption';
const fakeAgainstOption = 'fakeAgainstOption';
const fakeAbstainOption = 'fakeAbstainOption';

vi.mock('packages/errors/displayMutationError');

const next = async (nextButton: HTMLElement) => {
  await waitFor(() => expect(nextButton).toBeEnabled());
  fireEvent.click(nextButton);
};

const completeFirstStep = async (
  getByPlaceholderText: (id: Matcher, options?: MatcherOptions | undefined) => HTMLElement,
) => {
  const proposalNameInput = await waitFor(() =>
    // failing
    getByPlaceholderText(en.vote.createProposalForm.name),
  );

  const descriptionInput = await waitFor(() =>
    getByPlaceholderText(en.vote.createProposalForm.addDescription),
  );

  fireEvent.change(proposalNameInput, { target: { value: fakeName } });
  fireEvent.change(descriptionInput, { target: { value: fakeDescription } });
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
        handleClose={vi.fn()}
        createProposal={vi.fn()}
        isCreateProposalLoading={false}
      />,
    );
  });

  it('renders closed without crashing', async () => {
    renderComponent(
      <CreateProposalModal
        isOpen={false}
        handleClose={vi.fn()}
        createProposal={vi.fn()}
        isCreateProposalLoading={false}
      />,
    );
  });

  it('can enter title and description', async () => {
    const { getByPlaceholderText, getByText } = renderComponent(
      <CreateProposalModal
        isOpen
        handleClose={vi.fn()}
        createProposal={vi.fn()}
        isCreateProposalLoading={false}
      />,
      {
        routerInitialEntries: ['/governance/proposal-create'],
        routePath: `${routes.governance.path}/*`,
      },
    );

    const createManuallyButton = getByText(en.vote.createProposalModal.createManually).closest(
      'button',
    ) as HTMLButtonElement;

    await next(createManuallyButton);

    const nextButton = getByText(en.vote.createProposalForm.nextStep).closest(
      'button',
    ) as HTMLButtonElement;
    await waitFor(() => expect(nextButton).toBeDisabled());
    await completeFirstStep(getByPlaceholderText);
    await next(nextButton);
  });

  it('Complete vote option descriptions', async () => {
    const { getByPlaceholderText, getByText } = renderComponent(
      <CreateProposalModal
        isOpen
        handleClose={vi.fn()}
        createProposal={vi.fn()}
        isCreateProposalLoading={false}
      />,
      {
        routerInitialEntries: ['/governance/proposal-create'],
        routePath: `${routes.governance.path}/*`,
      },
    );

    const createManuallyButton = getByText(en.vote.createProposalModal.createManually).closest(
      'button',
    ) as HTMLButtonElement;

    await next(createManuallyButton);

    const nextButton = getByText(en.vote.createProposalForm.nextStep).closest(
      'button',
    ) as HTMLButtonElement;
    await completeFirstStep(getByPlaceholderText);
    await next(nextButton);
    await completeSecondStep(getByPlaceholderText);
    await next(nextButton);
  });

  it('Action Acccordion adds more fields when clicking button', async () => {
    const { getByPlaceholderText, getByText, getByTestId } = renderComponent(
      <CreateProposalModal
        isOpen
        handleClose={vi.fn()}
        createProposal={vi.fn()}
        isCreateProposalLoading={false}
      />,
      {
        routerInitialEntries: ['/governance/proposal-create'],
        routePath: `${routes.governance.path}/*`,
      },
    );

    const createManuallyButton = getByText(en.vote.createProposalModal.createManually).closest(
      'button',
    ) as HTMLButtonElement;

    await next(createManuallyButton);
    const nextButton = getByText(en.vote.createProposalForm.nextStep).closest(
      'button',
    ) as HTMLButtonElement;

    await completeFirstStep(getByPlaceholderText);
    await next(nextButton);

    await completeSecondStep(getByPlaceholderText);
    await next(nextButton);

    const addActionButton = await waitFor(
      () =>
        getByText(en.vote.createProposalForm.addOneMoreAction).closest(
          'button',
        ) as HTMLButtonElement,
    );

    const addressInput0 = await waitFor(() => getByTestId('actions.0.address'));
    const signatureInput0 = await waitFor(() => getByTestId('actions.0.signature'));

    fireEvent.change(addressInput0, { target: { value: fakeAddress } });
    fireEvent.change(signatureInput0, { target: { value: fakeSignature } });

    const dataInput0 = await waitFor(() => getByTestId('actions.0.callData.0'));
    const dataInput1 = await waitFor(() => getByTestId('actions.0.callData.1'));

    fireEvent.change(dataInput0, { target: { value: 'root' } });
    fireEvent.change(dataInput1, { target: { value: 'false' } });

    await waitFor(() => expect(addActionButton).toBeEnabled());
    await waitFor(() => fireEvent.click(addActionButton));

    await waitFor(() => getByTestId('actions.1.address'));
    await waitFor(() => getByTestId('actions.1.signature'));
  });

  it('Adding action button is disabled while actions are invalid', async () => {
    const { getByPlaceholderText, getByText, getByTestId } = renderComponent(
      <CreateProposalModal
        isOpen
        handleClose={vi.fn()}
        createProposal={vi.fn()}
        isCreateProposalLoading={false}
      />,
      {
        routerInitialEntries: ['/governance/proposal-create'],
        routePath: `${routes.governance.path}/*`,
      },
    );

    const createManuallyButton = getByText(en.vote.createProposalModal.createManually).closest(
      'button',
    ) as HTMLButtonElement;

    await next(createManuallyButton);
    const nextButton = getByText(en.vote.createProposalForm.nextStep).closest(
      'button',
    ) as HTMLButtonElement;

    await completeFirstStep(getByPlaceholderText);
    await next(nextButton);

    await completeSecondStep(getByPlaceholderText);
    await next(nextButton);

    const addActionButton = await waitFor(
      () =>
        getByText(en.vote.createProposalForm.addOneMoreAction).closest(
          'button',
        ) as HTMLButtonElement,
    );

    const addressInput0 = await waitFor(() => getByTestId('actions.0.address'));
    const signatureInput0 = await waitFor(() => getByTestId('actions.0.signature'));

    fireEvent.change(addressInput0, { target: { value: fakeAddress } });
    fireEvent.change(signatureInput0, { target: { value: fakeSignature } });

    const dataInput0 = await waitFor(() => getByTestId('actions.0.callData.0'));
    const dataInput1 = await waitFor(() => getByTestId('actions.0.callData.1'));

    fireEvent.change(dataInput0, { target: { value: 'root' } });
    fireEvent.change(dataInput1, { target: { value: 'false' } });

    await waitFor(() => fireEvent.click(addActionButton));

    fireEvent.change(signatureInput0, { target: { value: 'bad Address' } });
    await waitFor(() => expect(addActionButton).toBeDisabled());

    fireEvent.change(signatureInput0, { target: { value: fakeSignature } });
    await waitFor(() => expect(addActionButton).toBeEnabled());

    fireEvent.change(signatureInput0, { target: { value: '' } });
    await waitFor(() => expect(addActionButton).toBeDisabled());
  });

  it('Sets signature as accordion title', async () => {
    const { getByPlaceholderText, getByText, getByTestId } = renderComponent(
      <CreateProposalModal
        isOpen
        handleClose={vi.fn()}
        createProposal={vi.fn()}
        isCreateProposalLoading={false}
      />,
      {
        routerInitialEntries: ['/governance/proposal-create'],
        routePath: `${routes.governance.path}/*`,
      },
    );

    const createManuallyButton = getByText(en.vote.createProposalModal.createManually).closest(
      'button',
    ) as HTMLButtonElement;

    await next(createManuallyButton);

    const nextButton = getByText(en.vote.createProposalForm.nextStep).closest(
      'button',
    ) as HTMLButtonElement;

    await completeFirstStep(getByPlaceholderText);
    await next(nextButton);

    await completeSecondStep(getByPlaceholderText);
    await next(nextButton);

    const addActionButton = await waitFor(
      () =>
        getByText(en.vote.createProposalForm.addOneMoreAction).closest(
          'button',
        ) as HTMLButtonElement,
    );

    await waitFor(() => expect(addActionButton).toBeDisabled());

    const addressInput0 = await waitFor(() => getByTestId('actions.0.address'));
    const signatureInput0 = await waitFor(() => getByTestId('actions.0.signature'));

    fireEvent.change(addressInput0, { target: { value: fakeAddress } });
    fireEvent.change(signatureInput0, { target: { value: fakeSignature } });

    const dataInput0 = await waitFor(() => getByTestId('actions.0.callData.0'));
    const dataInput1 = await waitFor(() => getByTestId('actions.0.callData.1'));

    fireEvent.change(dataInput0, { target: { value: 'root' } });
    fireEvent.change(dataInput1, { target: { value: 'false' } });

    await waitFor(() => expect(addActionButton).toBeEnabled()); // failing

    fireEvent.click(addActionButton);
    await waitFor(() => getByText(fakeSignature).closest('p'));
  });

  it('Adds callData fields with correctly formatted signature', async () => {
    const { getByText, getAllByPlaceholderText, getByPlaceholderText } = renderComponent(
      <CreateProposalModal
        isOpen
        handleClose={vi.fn()}
        createProposal={vi.fn()}
        isCreateProposalLoading={false}
      />,
      {
        routerInitialEntries: ['/governance/proposal-create'],
        routePath: `${routes.governance.path}/*`,
      },
    );

    const createManuallyButton = getByText(en.vote.createProposalModal.createManually).closest(
      'button',
    ) as HTMLButtonElement;

    await next(createManuallyButton);

    const nextButton = getByText(en.vote.createProposalForm.nextStep).closest(
      'button',
    ) as HTMLButtonElement;

    await completeFirstStep(getByPlaceholderText);
    await next(nextButton);

    await completeSecondStep(getByPlaceholderText);
    await next(nextButton);

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

  it('Imports a valid proposal file and allows the VIP creation', async () => {
    const { getByText, getByTestId } = renderComponent(
      <CreateProposalModal
        isOpen
        handleClose={vi.fn()}
        createProposal={vi.fn()}
        isCreateProposalLoading={false}
      />,
      {
        routerInitialEntries: ['/governance/proposal-create'],
        routePath: '/governance/*',
      },
    );

    const importProposalButton = getByText(en.vote.createProposalModal.uploadFile).closest(
      'button',
    ) as HTMLButtonElement;

    await next(importProposalButton);

    const fileInput = getByTestId(TEST_IDS.fileInput) as HTMLInputElement;
    const file = new File([JSON.stringify(TEST_VIP)], 'test', { type: 'text/plain' });
    const contents = JSON.stringify(TEST_VIP);
    File.prototype.text = vi.fn().mockResolvedValueOnce(contents);

    fireEvent.change(fileInput, { target: { files: [file] } });

    const createButton = await waitFor(
      () => getByText(en.vote.createProposalForm.create).closest('button') as HTMLButtonElement,
    );
    await waitFor(() => expect(createButton).toBeEnabled());
  });

  it('Does not allow creating a VIP from an invalid proposal file', async () => {
    const { getByText, getByTestId } = renderComponent(
      <CreateProposalModal
        isOpen
        handleClose={vi.fn()}
        createProposal={vi.fn()}
        isCreateProposalLoading={false}
      />,
      {
        routerInitialEntries: ['/governance/proposal-create'],
        routePath: '/governance/*',
      },
    );

    const importProposalButton = getByText(en.vote.createProposalModal.uploadFile).closest(
      'button',
    ) as HTMLButtonElement;

    await next(importProposalButton);

    // alter a valid VIP file, introducing a param with a wrong type
    const invalidFile: Partial<typeof TEST_VIP> = {
      ...TEST_VIP,
      params: [...TEST_VIP.params.slice(0, -1), [[[false]]]],
    };

    const fileInput = getByTestId(TEST_IDS.fileInput) as HTMLInputElement;
    const file = new File([JSON.stringify(invalidFile)], 'test', { type: 'text/plain' });
    const contents = JSON.stringify(invalidFile);
    File.prototype.text = vi.fn().mockResolvedValueOnce(contents);

    fireEvent.change(fileInput, { target: { files: [file] } });

    // validation should not work, and we should display an error
    await waitFor(() => expect(displayMutationError).toHaveBeenCalledTimes(1));
    expect((displayMutationError as Vi.Mock).mock.calls[0][0]).toMatchInlineSnapshot(`
      {
        "error": [Error: validationError],
      }
    `);
  });
});
