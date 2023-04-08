import { ComponentMeta } from '@storybook/react';
import noop from 'noop-ts';
import React from 'react';

import { poolData } from '__mocks__/models/pools';
import { withCenterStory } from 'stories/decorators';

import { RepayFormUi } from '.';

const fakePool = poolData[0];
const fakeAsset = fakePool.assets[2];

export default {
  title: 'Forms/RepayForm',
  component: RepayFormUi,
  decorators: [withCenterStory({ width: 600 })],
} as ComponentMeta<typeof RepayFormUi>;

export const Default = () => (
  <RepayFormUi
    asset={fakeAsset}
    userBorrowBalanceInFromTokens={fakeAsset.userBorrowBalanceTokens}
    pool={fakePool}
    onRepay={noop}
    onSwapAndRepay={noop}
    onCloseModal={noop}
    onFormValuesChangeCallback={noop}
    isSwapLoading={false}
  />
);
