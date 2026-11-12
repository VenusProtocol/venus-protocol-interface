import { fireEvent, waitFor } from '@testing-library/react';

import { renderComponent } from 'testUtils/render';

import { ApprovalSteps } from '..';

const clickAt = (element: HTMLElement, nowMs: number) => {
  vi.spyOn(performance, 'now').mockReturnValue(nowMs);
  fireEvent.click(element);
};

const renderApprovalSteps = (approvalAction: () => Promise<unknown>) =>
  renderComponent(
    <ApprovalSteps
      approvalAction={approvalAction}
      showApprovalSteps
      isApprovalActionLoading={false}
      firstStepLabel="Step 1"
      firstStepButtonLabel="Approve USDT"
      secondStepLabel="Step 2"
      secondStepButtonLabel="Supply"
    >
      <span />
    </ApprovalSteps>,
  );

describe('ApprovalSteps', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('requests a single approval on a double-click', () => {
    const approvalAction = vi.fn(() => new Promise(() => {}));
    const { getByRole } = renderApprovalSteps(approvalAction);
    const button = getByRole('button', { name: 'Approve USDT' });

    clickAt(button, 1000);
    clickAt(button, 1008);

    expect(approvalAction).toHaveBeenCalledTimes(1);
  });

  it('requests approval again after the wallet prompt is rejected', async () => {
    const approvalAction = vi.fn(() => Promise.reject(new Error('User rejected the request')));
    const { getByRole } = renderApprovalSteps(approvalAction);
    const button = getByRole('button', { name: 'Approve USDT' });

    clickAt(button, 1000);
    await waitFor(() => expect(approvalAction).toHaveBeenCalledTimes(1));

    clickAt(button, 2500);

    await waitFor(() => expect(approvalAction).toHaveBeenCalledTimes(2));
  });
});
