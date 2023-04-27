import { waitFor } from '@testing-library/react';
import noop from 'noop-ts';
import React from 'react';

import fakeAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import useTokenApproval from 'hooks/useTokenApproval';
import renderComponent from 'testUtils/renderComponent';

import EnableToken from '.';

jest.mock('clients/api');
jest.mock('components/Toast');

const fakeAsset = assetData[0];
const fakeContent = 'Fake Content';

describe('components/EnableToken', () => {
  it('asks the user to enable token if not enabled', async () => {
    // Mark all tokens as having not been approved
    (useTokenApproval as jest.Mock).mockImplementation(() => ({
      isTokenApproved: false,
      isTokenApprovalStatusLoading: false,
      isApproveTokenLoading: false,
      approveToken: noop,
    }));

    const fakeEnableTitle = 'Enable token to proceed';

    const { getByText } = renderComponent(
      <EnableToken
        token={fakeAsset.vToken.underlyingToken}
        title={fakeEnableTitle}
        spenderAddress={fakeAddress}
      >
        {fakeContent}
      </EnableToken>,
    );

    await waitFor(() => expect(getByText(fakeEnableTitle)));
  });

  it('renders content when token is enabled', async () => {
    const { getByText } = renderComponent(
      <EnableToken
        token={fakeAsset.vToken.underlyingToken}
        title="Enable token to proceed"
        spenderAddress={fakeAddress}
      >
        {fakeContent}
      </EnableToken>,
    );

    await waitFor(() => expect(getByText(fakeContent)));
  });
});
