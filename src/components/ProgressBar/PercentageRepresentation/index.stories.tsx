import { Meta } from '@storybook/react';
import React from 'react';

import { withCenterStory } from 'stories/decorators';

import { PercentageRepresentation } from '.';

export default {
  title: 'Components/PercentageRepresentation',
  component: PercentageRepresentation,
  decorators: [withCenterStory({ width: 100 })],
} as Meta<typeof PercentageRepresentation>;

export const PercentageRepresentationDefault = () => <PercentageRepresentation value={30} />;
