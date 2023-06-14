import { Meta } from '@storybook/react';
import noop from 'noop-ts';
import React from 'react';

import { withCenterStory } from 'stories/decorators';

import { LunaUstWarningModal } from '.';

export default {
  title: 'Components/LunaUstWarningModal',
  component: LunaUstWarningModal,
  decorators: [withCenterStory({ width: 55 })],
} as Meta<typeof LunaUstWarningModal>;

export const Default = () => <LunaUstWarningModal onClose={noop} />;
