import type { Meta } from '@storybook/react';

import { ProposalType as ProposalTypeEnum } from 'types';

import { ActiveChip, BlueChip, Chip, ErrorChip, InactiveChip, ProposalTypeChip } from '.';

export default {
  title: 'Components/Chip',
  component: Chip,
} as Meta<typeof Chip>;

export const Default = () => <Chip text="Some text" />;

export const WithIcon = () => <Chip text="Some text" iconName="lightning" />;

export const Active = () => <ActiveChip text="Some text" />;

export const ActiveWithIcon = () => <ActiveChip text="Some text" iconName="check" />;

export const Inactive = () => <InactiveChip text="Some text" />;

export const Blue = () => <BlueChip text="Some text" />;

export const Err = () => <ErrorChip text="Some text" />;

export const FastTrackProposalType = () => (
  <ProposalTypeChip proposalType={ProposalTypeEnum.FAST_TRACK} />
);

export const CriticalProposalType = () => (
  <ProposalTypeChip proposalType={ProposalTypeEnum.CRITICAL} />
);
