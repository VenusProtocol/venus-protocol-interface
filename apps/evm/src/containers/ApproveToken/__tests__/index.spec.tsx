import type { Mock } from 'vitest';

import { fireEvent, waitFor } from '@testing-library/react';
import fakeSpenderAddress from '__mocks__/models/address';
import { xvs } from '__mocks__/models/tokens';
import useTokenApproval from 'hooks/useTokenApproval';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import { ApproveToken, type ApproveTokenProps } from '..';

const props: ApproveTokenProps = {
  token: xvs,
  spenderAddress: fakeSpenderAddress,
  secondStepButtonLabel: 'Fake second step button label',
  children: 'Fake children',
};

vi.mock('hooks/useTokenApproval');

describe('ApproveToken', () => {
  it('prompts user to approve token if it is not', async () => {
    const mockApproveToken = vi.fn();

    (useTokenApproval as Mock).mockImplementation(() => ({
      approveToken: mockApproveToken,
      isTokenApproved: false,
      isApproveTokenLoading: false,
      isWalletSpendingLimitLoading: false,
    }));

    const { getByText } = renderComponent(<ApproveToken {...props} />);

    const submitButtonLabel = en.approveTokenSteps.approveTokenButton.text.replace(
      '{{tokenSymbol}}',
      xvs.symbol,
    );

    await waitFor(() => expect(getByText(submitButtonLabel)));

    fireEvent.click(getByText(submitButtonLabel));

    expect(mockApproveToken).toHaveBeenCalledTimes(1);
  });

  it('displays children if token is approved', async () => {
    (useTokenApproval as Mock).mockImplementation(() => ({
      approveToken: vi.fn(),
      isTokenApproved: true,
      isApproveTokenLoading: false,
      isWalletSpendingLimitLoading: false,
    }));

    const { getByText } = renderComponent(<ApproveToken {...props} />);

    await waitFor(() => expect(getByText(props.children as string)));
  });
});
