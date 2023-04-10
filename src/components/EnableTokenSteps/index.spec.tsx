import { waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import fakeAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import { getAllowance } from 'clients/api';
import MAX_UINT256 from 'constants/maxUint256';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import { EnableTokenSteps } from '.';

jest.mock('clients/api');
jest.mock('components/Toast');

const fakeAsset = assetData[0];
const fakeContent = 'Fake content';
const fakeSubmitButtonLabel = 'Fake submit button label';

describe('components/EnableTokenSteps', () => {
  it('asks the user to enable token if not enabled', async () => {
    (getAllowance as jest.Mock).mockImplementationOnce(() => ({
      allowanceWei: new BigNumber(0),
    }));

    const { getByText } = renderComponent(
      <EnableTokenSteps
        token={fakeAsset.vToken.underlyingToken}
        spenderAddress={fakeAddress}
        submitButtonLabel={fakeSubmitButtonLabel}
      >
        {() => fakeContent}
      </EnableTokenSteps>,
    );

    const enableButtonText = en.enableTokenSteps.enableTokenButton.text.replace(
      '{{tokenSymbol}}',
      fakeAsset.vToken.underlyingToken.symbol,
    );
    await waitFor(() => expect(getByText(enableButtonText)));
  });

  it('renders content when hideTokenEnablingStep is true, even if user has not enabled token', async () => {
    (getAllowance as jest.Mock).mockImplementationOnce(() => ({
      allowanceWei: new BigNumber(0),
    }));

    const { getByText } = renderComponent(
      <EnableTokenSteps
        token={fakeAsset.vToken.underlyingToken}
        spenderAddress={fakeAddress}
        submitButtonLabel={fakeSubmitButtonLabel}
      >
        {() => fakeContent}
      </EnableTokenSteps>,
    );

    await waitFor(() => expect(getByText(fakeContent)));
  });

  it('renders content when token is enabled', async () => {
    (getAllowance as jest.Mock).mockImplementationOnce(() => ({
      allowanceWei: MAX_UINT256,
    }));

    const { getByText } = renderComponent(
      <EnableTokenSteps
        token={fakeAsset.vToken.underlyingToken}
        spenderAddress={fakeAddress}
        submitButtonLabel={fakeSubmitButtonLabel}
      >
        {() => fakeContent}
      </EnableTokenSteps>,
    );

    await waitFor(() => expect(getByText(fakeContent)));
  });
});
