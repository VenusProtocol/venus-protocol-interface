import React from 'react';
import { waitFor } from '@testing-library/react';

import MAX_UINT256 from 'constants/maxUint256';
import { getAllowance } from 'clients/api';
import renderComponent from 'testUtils/renderComponent';
import { assetData } from '__mocks__/models/asset';
import EnableToken from '.';

jest.mock('clients/api');
jest.mock('components/v2/Toast');

const fakeAsset = assetData[0];
const fakeContent = 'Fake Content';

describe('components/EnableToken', () => {
  it('asks the user to enable token if not enabled', async () => {
    (getAllowance as jest.Mock).mockImplementationOnce(() => 0);

    const fakeEnableTitle = 'Enable token to proceed';

    const { getByText } = renderComponent(
      <EnableToken vTokenId={fakeAsset.id} title={fakeEnableTitle}>
        {fakeContent}
      </EnableToken>,
    );

    await waitFor(() => expect(getByText(fakeEnableTitle)));
  });

  it('renders content when token is enabled', async () => {
    (getAllowance as jest.Mock).mockImplementationOnce(() => MAX_UINT256);

    const { getByText } = renderComponent(
      <EnableToken vTokenId={fakeAsset.id} title="Enable token to proceed">
        {fakeContent}
      </EnableToken>,
    );

    await waitFor(() => expect(getByText(fakeContent)));
  });
});
