import { fireEvent, waitFor } from '@testing-library/react';
import noop from 'noop-ts';

import { renderComponent } from 'testUtils/render';

import { en } from 'libs/translations';

import { ApproveDelegateSteps } from '.';

const fakeContent = 'Fake content';

describe('ApproveDelegateSteps', () => {
  it('asks user to approve the delegate contract and lets them do so if they have not already', async () => {
    const approveTokenMock = vi.fn();

    const { getByText } = renderComponent(
      <ApproveDelegateSteps
        isDelegateeApproved={false}
        isApproveDelegateeLoading={false}
        isDelegateeApprovedLoading={false}
        secondStepButtonLabel={fakeContent}
        approveDelegateeAction={approveTokenMock}
      >
        {fakeContent}
      </ApproveDelegateSteps>,
    );

    const approveButtonText = en.approveDelegateSteps.approveDelegateButton.text;

    await waitFor(() => expect(getByText(approveButtonText)));

    // Click on approve button
    fireEvent.click(getByText(approveButtonText));

    await waitFor(() => expect(approveTokenMock).toHaveBeenCalledTimes(1));
  });

  it('does not render steps to approve delegate if it is already approved', async () => {
    const { getByText, queryByText } = renderComponent(
      <ApproveDelegateSteps
        secondStepButtonLabel={fakeContent}
        isDelegateeApproved
        isApproveDelegateeLoading={false}
        isDelegateeApprovedLoading={false}
        approveDelegateeAction={noop}
      >
        {fakeContent}
      </ApproveDelegateSteps>,
    );

    await waitFor(() => expect(getByText(fakeContent)));
    expect(queryByText(en.approveDelegateSteps.step1)).toBeNull();
  });
});
