import type { Meta } from '@storybook/react';

import { withCenterStory, withThemeProvider } from 'stories/decorators';

import { ActiveChip, BlueChip, Chip, ErrorChip, InactiveChip, ProposalTypeChip } from '.';

export default {
  title: 'Components/Chip',
  component: Chip,
  decorators: [withThemeProvider, withCenterStory({ width: 200 })],
} as Meta<typeof Chip>;

export const Default = () => <Chip text="Some text" />;

export const Active = () => <ActiveChip text="Some text" />;

export const Inactive = () => <InactiveChip text="Some text" />;

export const Blue = () => <BlueChip text="Some text" />;

export const Err = () => <ErrorChip text="Some text" />;

export const ProposalType = () => <ProposalTypeChip proposalType={1} />;
