import { waitFor } from '@testing-library/dom';
import { en } from 'libs/translations';

export const checkSubmitButtonIsDisabled = async () => {
  const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
  await waitFor(() =>
    expect(submitButton).toHaveTextContent(en.operationForm.submitButtonLabel.enterValidAmount),
  );
  expect(submitButton).toBeDisabled();
};

export const checkSubmitButtonIsDisabledOnly = async () => {
  const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
  expect(submitButton).toBeDisabled();
};

export const checkSubmitButtonIsEnabled = async ({ textContent }: { textContent: string }) => {
  const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
  await waitFor(() => expect(submitButton).toHaveTextContent(textContent));
  expect(submitButton).toBeEnabled();
};
