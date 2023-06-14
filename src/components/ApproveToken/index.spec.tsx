import { waitFor } from '@testing-library/react';
import noop from 'noop-ts';
import React from 'react';
import Vi from 'vitest';

import fakeAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import useTokenApproval from 'hooks/useTokenApproval';
import renderComponent from 'testUtils/renderComponent';

import ApproveToken from '.';

vi.mock('clients/api');
vi.mock('components/Toast');

const fakeAsset = assetData[0];
const fakeContent = 'Fake Content';

describe('components/ApproveToken', () => {
  it('asks the user to approve token if not approved', async () => {
    // Mark all tokens as having not been approved
    (useTokenApproval as Vi.Mock).mockImplementation(() => ({
      isTokenApproved: false,
      isTokenApprovalStatusLoading: false,
      isApproveTokenLoading: false,
      approveToken: noop,
    }));

    const fakeEnableTitle = 'Enable token to proceed';

    const { getByText } = renderComponent(
      <ApproveToken
        token={fakeAsset.vToken.underlyingToken}
        title={fakeEnableTitle}
        spenderAddress={fakeAddress}
      >
        {fakeContent}
      </ApproveToken>,
    );

    await waitFor(() => expect(getByText(fakeEnableTitle)));
  });

  it('renders content when token is approved', async () => {
    const { getByText } = renderComponent(
      <ApproveToken
        token={fakeAsset.vToken.underlyingToken}
        title="Enable token to proceed"
        spenderAddress={fakeAddress}
      >
        {fakeContent}
      </ApproveToken>,
    );

    await waitFor(() => expect(getByText(fakeContent)));
  });
});
