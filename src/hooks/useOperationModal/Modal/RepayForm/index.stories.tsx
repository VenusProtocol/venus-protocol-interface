import { Meta } from '@storybook/react';
import noop from 'noop-ts';
import React from 'react';

import { poolData } from '__mocks__/models/pools';
import { xvs } from '__mocks__/models/tokens';
import { withCenterStory } from 'stories/decorators';

import { RepayFormUi } from '.';

const fakePool = poolData[0];
const fakeAsset = fakePool.assets[2];

export default {
  title: 'Components/OperationModal/RepayForm',
  component: RepayFormUi,
  decorators: [withCenterStory({ width: 600 })],
} as Meta<typeof RepayFormUi>;

export const Default = () => (
  <RepayFormUi
    asset={fakeAsset}
    pool={fakePool}
    isIntegratedSwapEnabled={false}
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
