import { fireEvent, waitFor } from '@testing-library/react';
import noop from 'noop-ts';
import React from 'react';
import Vi from 'vitest';

import fakeAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import useTokenApproval from 'hooks/useTokenApproval';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import { ApproveTokenSteps } from '.';

vi.mock('clients/api');
vi.mock('components/Toast');

const fakeAsset = assetData[0];
const fakeContent = 'Fake content';
const fakeSubmitButtonLabel = 'Fake submit button label';

describe('components/ApproveTokenSteps', () => {
  it('asks user to enable token and lets them do so if they have not already', async () => {
    const approveTokenMock = vi.fn();

    // Mark all tokens as having not been approved
    (useTokenApproval as Vi.Mock).mockImplementation(() => ({
      isTokenApproved: false,
      isTokenApprovalStatusLoading: false,
      isApproveTokenLoading: false,
      approveToken: approveTokenMock,
    }));

    const { getByText } = renderComponent(
      <ApproveTokenSteps
        token={fakeAsset.vToken.underlyingToken}
        spenderAddress={fakeAddress}
        submitButtonLabel={fakeSubmitButtonLabel}
      >
        {() => fakeContent}
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

  it('renders content when hideTokenEnablingStep is true, even if user has not enabled token', async () => {
    // Mark all tokens as having not been approved
    (useTokenApproval as Vi.Mock).mockImplementation(() => ({
      isTokenApproved: false,
      isTokenApprovalStatusLoading: false,
      isApproveTokenLoading: false,
      approveToken: noop,
    }));

    const { getByText } = renderComponent(
      <ApproveTokenSteps
        token={fakeAsset.vToken.underlyingToken}
        spenderAddress={fakeAddress}
        submitButtonLabel={fakeSubmitButtonLabel}
        hideTokenEnablingStep
      >
        {() => fakeContent}
      </ApproveTokenSteps>,
    );

    await waitFor(() => expect(getByText(fakeContent)));
  });

  it('renders content when token is enabled', async () => {
    const { getByText } = renderComponent(
      <ApproveTokenSteps
        token={fakeAsset.vToken.underlyingToken}
        spenderAddress={fakeAddress}
        submitButtonLabel={fakeSubmitButtonLabel}
      >
        {() => fakeContent}
      </ApproveTokenSteps>,
    );

    await waitFor(() => expect(getByText(fakeContent)));
  });
});
