import { Meta } from '@storybook/react';
import noop from 'noop-ts';

import CreateProposalModal from '.';

export default {
  title: 'Pages/Proposal/CreateProposalModal',
  component: CreateProposalModal,
} as Meta<typeof CreateProposalModal>;

export const Default = () => (
  <CreateProposalModal
    isOpen
    handleClose={noop}
    createProposal={noop}
    isCreateProposalLoading={false}
  />
);
