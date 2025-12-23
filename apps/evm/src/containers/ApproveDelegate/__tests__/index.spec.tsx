import type { Mock } from 'vitest';

import { fireEvent, waitFor } from '@testing-library/react';
import fakePoolComptrollerContractAddress, {
  altAddress as delegateeAddress,
} from '__mocks__/models/address';
import useDelegateApproval from 'hooks/useDelegateApproval';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import { ApproveDelegate, type ApproveDelegateProps } from '..';

const props: ApproveDelegateProps = {
  poolComptrollerContractAddress: fakePoolComptrollerContractAddress,
  delegateeAddress: delegateeAddress,
  secondStepButtonLabel: 'Fake second step button label',
  children: 'Fake children',
};

vi.mock('hooks/useDelegateApproval');

describe('ApproveDelegate', () => {
  it('prompts user to approve delegatee if it is not', async () => {
    const mockUpdatePoolDelegateStatus = vi.fn();

    (useDelegateApproval as Mock).mockImplementation(() => ({
      updatePoolDelegateStatus: mockUpdatePoolDelegateStatus,
      isDelegateApproved: false,
      isUpdateDelegateStatusLoading: false,
      isDelegateApprovedLoading: false,
    }));

    const { getByText } = renderComponent(<ApproveDelegate {...props} />);

    await waitFor(() => expect(getByText(en.approveDelegateSteps.approveDelegateButton.text)));

    fireEvent.click(getByText(en.approveDelegateSteps.approveDelegateButton.text));

    expect(mockUpdatePoolDelegateStatus).toHaveBeenCalledTimes(1);
    expect((mockUpdatePoolDelegateStatus as Mock).mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "approvedStatus": true,
        },
      ]
    `);
  });

  it('displays children if delegate is approved', async () => {
    (useDelegateApproval as Mock).mockImplementation(() => ({
      updatePoolDelegateStatus: vi.fn(),
      isDelegateApproved: true,
      isUpdateDelegateStatusLoading: false,
      isDelegateApprovedLoading: false,
    }));

    const { getByText } = renderComponent(<ApproveDelegate {...props} />);

    await waitFor(() => expect(getByText(props.children as string)));
  });
});
