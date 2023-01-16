import { ComponentMeta } from '@storybook/react';
import noop from 'noop-ts';
import React from 'react';

import fakeAddress from '__mocks__/models/address';
import { withRouter } from 'stories/decorators';

import DelegateModal from '.';

export default {
  title: 'Pages/Vote/DelegateModal',
  component: DelegateModal,
  decorators: [withRouter],
} as ComponentMeta<typeof DelegateModal>;

export const Default = () => (
  <DelegateModal
    isOpen
    onClose={noop}
    currentUserAccountAddress={fakeAddress}
    setVoteDelegation={noop}
    previouslyDelegated={false}
    isVoteDelegationLoading={false}
    openAuthModal={noop}
  />
);
