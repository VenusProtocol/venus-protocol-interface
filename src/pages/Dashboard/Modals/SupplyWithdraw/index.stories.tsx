import React from 'react';
import { BigNumber } from 'bignumber.js';
import noop from 'noop-ts';
import fakeAddress from '__mocks__/models/address';
import { getVBepToken } from 'utilities';
import { VTokenId } from 'types';
import { ComponentMeta, Story } from '@storybook/react';
import { withCenterStory, withAuthContext, withEnabledToken } from 'stories/decorators';
import { assetData } from '__mocks__/models/asset';
import { SupplyWithdrawUi, ISupplyWithdrawUiProps, ISupplyWithdrawProps } from '.';

export default {
  title: 'Pages/Dashboard/Modals/SupplyWithdraw',
  component: SupplyWithdrawUi,
  decorators: [withCenterStory({ width: 600 })],
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
} as ComponentMeta<typeof SupplyWithdrawUi>;

const Template: Story<ISupplyWithdrawUiProps & ISupplyWithdrawProps> = args => (
  <SupplyWithdrawUi {...args} />
);

const context = {
  login: noop,
  logOut: noop,
  openAuthModal: noop,
  closeAuthModal: noop,
  account: {
    address: fakeAddress,
  },
};

export const DisconnectedSupply = Template.bind({});
DisconnectedSupply.args = {
  asset: assetData[0],
  assets: assetData,
  onClose: noop,
  userTotalBorrowBalanceCents: new BigNumber('16'),
  userTotalBorrowLimitCents: new BigNumber('42.38'),
  isSupplyLoading: false,
  isWithdrawLoading: false,
};

export const DisabledSupply = Template.bind({});
DisabledSupply.decorators = [withAuthContext(context)];
DisabledSupply.args = {
  asset: assetData[0],
  assets: assetData,
  onClose: noop,
  userTotalBorrowBalanceCents: new BigNumber('16'),
  userTotalBorrowLimitCents: new BigNumber('42.38'),
  onSubmitSupply: noop,
  onSubmitWithdraw: noop,
  isSupplyLoading: false,
  isWithdrawLoading: false,
};

export const Supply = Template.bind({});
Supply.decorators = [
  withAuthContext(context),
  withEnabledToken({
    tokenId: assetData[0].id,
    accountAddress: fakeAddress,
    spenderAddress: getVBepToken(assetData[0].id as VTokenId).address,
  }),
];
Supply.args = {
  asset: assetData[0],
  assets: assetData,
  onClose: noop,
  userTotalBorrowBalanceCents: new BigNumber('16'),
  userTotalBorrowLimitCents: new BigNumber('42.38'),
  onSubmitSupply: noop,
  onSubmitWithdraw: noop,
  isSupplyLoading: false,
  isWithdrawLoading: false,
};
