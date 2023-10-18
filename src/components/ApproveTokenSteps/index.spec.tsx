import { fireEvent, waitFor } from '@testing-library/react';
import noop from 'noop-ts';

import { assetData } from '__mocks__/models/asset';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import { ApproveTokenSteps } from '.';

vi.mock('components/Toast');

const fakeAsset = assetData[0];
const fakeContent = 'Fake content';

describe('components/ApproveTokenSteps', () => {
  it('asks user to enable token and lets them do so if they have not already', async () => {
    const approveTokenMock = vi.fn();

    const { getByText } = renderComponent(
      <ApproveTokenSteps
        isTokenApproved={false}
        isWalletSpendingLimitLoading={false}
        isApproveTokenLoading={false}
        approveToken={approveTokenMock}
        token={fakeAsset.vToken.underlyingToken}
      >
        {fakeContent}
      </ApproveTokenSteps>,
    );

    const approveButtonText = en.approveTokenSteps.approveTokenButton.text.replace(
      '{{tokenSymbol}}',
      fakeAsset.vToken.underlyingToken.symbol,
    );

    await waitFor(() => expect(getByText(approveButtonText)));

    // Click on enable button
    fireEvent.click(getByText(approveButtonText));

    await waitFor(() => expect(approveTokenMock).toHaveBeenCalledTimes(1));
  });

  it('does not render steps to enable token when hideTokenEnablingStep is true', async () => {
    const { getByText, queryByText } = renderComponent(
      <ApproveTokenSteps
        isTokenApproved={false}
        isWalletSpendingLimitLoading={false}
        isApproveTokenLoading={false}
        approveToken={noop}
        token={fakeAsset.vToken.underlyingToken}
        hideTokenEnablingStep
      >
        {fakeContent}
      </ApproveTokenSteps>,
    );

    await waitFor(() => expect(getByText(fakeContent)));
    expect(queryByText(en.approveTokenSteps.step1)).toBeNull();
  });

  it('does not render steps to enable token when token is enabled', async () => {
    const { getByText, queryByText } = renderComponent(
      <ApproveTokenSteps
        isTokenApproved
        isWalletSpendingLimitLoading={false}
        isApproveTokenLoading={false}
        approveToken={noop}
        token={fakeAsset.vToken.underlyingToken}
      >
        {fakeContent}
      </ApproveTokenSteps>,
    );

    await waitFor(() => expect(getByText(fakeContent)));
    expect(queryByText(en.approveTokenSteps.step1)).toBeNull();
  });
});
