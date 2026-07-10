import { waitFor } from '@testing-library/dom';

export const checkSubmitButtonIsDisabled = async () => {
  const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
  await waitFor(() => expect(submitButton).toBeDisabled());
};

export const checkSubmitButtonIsEnabled = async ({ textContent }: { textContent: string }) => {
  const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
  await waitFor(() => expect(submitButton).toHaveTextContent(textContent));
  expect(submitButton).toBeEnabled();
};
