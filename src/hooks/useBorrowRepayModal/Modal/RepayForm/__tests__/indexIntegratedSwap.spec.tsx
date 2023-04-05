import { waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import _cloneDeep from 'lodash/cloneDeep';
import noop from 'noop-ts';
import React from 'react';
import { TokenBalance } from 'types';
import { convertTokensToWei, isFeatureEnabled } from 'utilities';

import fakeAccountAddress from '__mocks__/models/address';
import { selectToken } from 'components/SelectTokenTextField/__tests__/testUtils';
import { PANCAKE_SWAP_TOKENS } from 'constants/tokens';
import useGetSwapTokenUserBalances from 'hooks/useGetSwapTokenUserBalances';
import renderComponent from 'testUtils/renderComponent';
import originalIsFeatureEnabledMock from 'utilities/__mocks__/isFeatureEnabled';

import Repay from '..';
import TEST_IDS from '../testIds';
import { fakeAsset, fakePool } from './fakeData';

jest.mock('clients/api');
jest.mock('hooks/useGetSwapTokenUserBalances');
jest.mock('hooks/useSuccessfulTransactionModal');

describe('hooks/useBorrowRepayModal/Repay - Feature flag enabled: integratedSwap', () => {
  beforeEach(() => {
    (isFeatureEnabled as jest.Mock).mockImplementation(
      featureFlag => featureFlag === 'integratedSwap',
    );
  });

  afterEach(() => {
    (isFeatureEnabled as jest.Mock).mockRestore();
    (isFeatureEnabled as jest.Mock).mockImplementation(originalIsFeatureEnabledMock);
  });

  it('renders without crashing', () => {
    renderComponent(<Repay asset={fakeAsset} pool={fakePool} onCloseModal={noop} />);
  });

  it.only('displays correct wallet balance', async () => {
    const fakeBalanceTokens = '10';
    const fakeTokenBalances: TokenBalance[] = [
      {
        token: PANCAKE_SWAP_TOKENS.busd,
        balanceWei: convertTokensToWei({
          value: new BigNumber(fakeBalanceTokens),
          token: PANCAKE_SWAP_TOKENS.busd,
        }),
      },
    ];

    (useGetSwapTokenUserBalances as jest.Mock).mockImplementation(() => ({
      data: fakeTokenBalances,
    }));

    const { getByText, container } = renderComponent(
      <Repay asset={fakeAsset} pool={fakePool} onCloseModal={noop} />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.selectTokenTextField,
      token: PANCAKE_SWAP_TOKENS.busd,
    });

    await waitFor(() =>
      getByText(`${fakeBalanceTokens} ${PANCAKE_SWAP_TOKENS.busd.symbol.toUpperCase()}`),
    );
  });

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
