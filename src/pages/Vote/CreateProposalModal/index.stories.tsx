import React from 'react';
import { ComponentMeta } from '@storybook/react';
import noop from 'noop-ts';
import CreateProposalModal from '.';

export default {
  title: 'Pages/Proposal/CreateProposalModal',
  component: CreateProposalModal,
} as ComponentMeta<typeof CreateProposalModal>;

export const Default = () => (
  <CreateProposalModal isOpen handleClose={noop} createProposal={noop} />
);
