import { Meta, StoryFn } from '@storybook/react';
import noop from 'noop-ts';

import { vXvs } from '__mocks__/models/vTokens';
import { withCenterStory } from 'stories/decorators';

import OperationModal, { OperationModalProps } from '.';

export default {
  title: 'Components/OperationModal',
  component: OperationModal,
  decorators: [withCenterStory({ width: 600 })],
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
} as Meta<typeof OperationModal>;

const Template: StoryFn<OperationModalProps> = args => <OperationModal {...args} />;

export const Disconnected = Template.bind({});
Disconnected.args = {
  vToken: vXvs,
  onClose: noop,
};
