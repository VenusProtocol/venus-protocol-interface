import _cloneDeep from 'lodash/cloneDeep';
import noop from 'noop-ts';
import React from 'react';
import { isFeatureEnabled } from 'utilities';

import renderComponent from 'testUtils/renderComponent';
import originalIsFeatureEnabledMock from 'utilities/__mocks__/isFeatureEnabled';

import Repay from '..';
import { fakeAsset, fakePool } from './fakeData';

jest.mock('clients/api');
jest.mock('hooks/useSuccessfulTransactionModal');

describe('hooks/useBorrowRepayModal/Repay - Feature flag enabled: isolatedPools', () => {
  beforeEach(() => {
    (isFeatureEnabled as jest.Mock).mockImplementation(
      featureFlag => featureFlag === 'isolatedPools',
    );
  });

  afterEach(() => {
    (isFeatureEnabled as jest.Mock).mockRestore();
    (isFeatureEnabled as jest.Mock).mockImplementation(originalIsFeatureEnabledMock);
  });

  it('renders without crashing', () => {
    renderComponent(<Repay asset={fakeAsset} pool={fakePool} onCloseModal={noop} />);
  });

  it.todo('displays correct wallet balance');

  it.todo('disables form if no amount was entered in input');

  it.todo('disables submit button if swap consists in a wrap');

  it.todo('disables submit button if swap consists in a unwrap');

  it.todo('disables submit button if no swap is found');

  it.todo('disables submit button if amount entered in input is higher than wallet balance');

  it.todo(
    'disables submit button if amount entered in input would be higher than borrow balance after swapping',
  );

  it.todo('displays correct swap details');

  it.todo(
    'updates input value to wallet balance when pressing on max button if wallet balance would be lower than borrow balance after swapping',
  );

  it.todo(
    'updates input value to borrow balance when pressing on max button if wallet balance is high enough to cover borrow balance after swapping',
  );

  it.todo('updates input value to correct value when pressing on preset percentage buttons');

  it.todo(
    'lets user swap and repay borrowed tokens, then displays successful transaction modal and calls onClose callback on success',
  );

  it.todo('lets user swap and repay full loan');
});
