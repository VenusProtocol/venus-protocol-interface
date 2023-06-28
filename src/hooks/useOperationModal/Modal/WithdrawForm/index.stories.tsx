import { Meta } from '@storybook/react';
import noop from 'noop-ts';
import React from 'react';

import { poolData } from '__mocks__/models/pools';
import { TESTNET_TOKENS } from 'constants/tokens';
import { withCenterStory } from 'stories/decorators';

import { WithdrawFormUi } from '.';

const fakePool = poolData[0];
const fakeAsset = fakePool.assets[2];

export default {
  title: 'Components/OperationModal/WithdrawForm',
  component: WithdrawFormUi,
  decorators: [withCenterStory({ width: 600 })],
} as Meta<typeof WithdrawFormUi>;

export const Default = () => (
  <WithdrawFormUi
    asset={fakeAsset}
    pool={fakePool}
    onSubmit={noop}
    onCloseModal={noop}
    isSubmitting={false}
    formValues={{
      fromToken: TESTNET_TOKENS.xvs,
      amountTokens: '',
    }}
    setFormValues={noop}
  />
);
