import { waitFor } from '@testing-library/dom';
import Vi from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { renderComponent } from 'testUtils/render';

import { UseIsFeatureEnabled, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { en } from 'libs/translations';

import { Borrow } from '..';
import TEST_IDS from '../testIds';

describe('Borrow - Feature enabled: Prime', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Vi.Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabled) => name === 'prime',
    );
  });

  it('displays a warning and disables form if Prime feature is enabled and user is not Prime', async () => {
    const { getByTestId, getByText } = renderComponent(<Borrow />, {
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() => expect(getByTestId(TEST_IDS.primeOnlyWarning)));

    const submitButton = getByText(en.vai.borrow.submitButton.enterValidAmountLabel).closest(
      'button',
    ) as HTMLButtonElement;
    await waitFor(() => expect(submitButton).toBeDisabled());
  });
});
