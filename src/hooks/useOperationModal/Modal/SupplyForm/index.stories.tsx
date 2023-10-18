import { Meta } from '@storybook/react';
import noop from 'noop-ts';
import React from 'react';
import { ChainId } from 'types';

import { poolData } from '__mocks__/models/pools';
import { xvs } from '__mocks__/models/tokens';
import { withCenterStory } from 'stories/decorators';

import { SupplyFormUi } from '.';

const fakePool = poolData[0];
const fakeAsset = fakePool.assets[2];

export default {
  title: 'Components/OperationModal/SupplyForm',
  component: SupplyFormUi,
  decorators: [withCenterStory({ width: 600 })],
} as Meta<typeof SupplyFormUi>;

export const Default = () => (
  <SupplyFormUi
    asset={fakeAsset}
    isIntegratedSwapEnabled={false}
    chainId={ChainId.BSC_TESTNET}
    pool={fakePool}
    onSubmit={noop}
    onCloseModal={noop}
    isSwapLoading={false}
    isSubmitting={false}
    formValues={{
      fromToken: xvs,
      amountTokens: '',
    }}
    setFormValues={noop}
    isFromTokenApproved
    approveFromToken={noop}
    isApproveFromTokenLoading={false}
    isFromTokenWalletSpendingLimitLoading={false}
    revokeFromTokenWalletSpendingLimit={noop}
    isRevokeFromTokenWalletSpendingLimitLoading={false}
  />
);
