import React from 'react';

import { ComponentMeta } from '@storybook/react';
import { withCenterStory } from 'stories/decorators';
import fakeAddress from '__mocks__/models/address';
import { EllipseAddress } from '.';

export default {
  title: 'Components/EnableToken',
  component: EllipseAddress,
  decorators: [withCenterStory({ width: 450 })],
} as ComponentMeta<typeof EllipseAddress>;

export const Default = () => <EllipseAddress address={fakeAddress} />;

export const WithEllipseBreakpoint = () => (
  <EllipseAddress address={fakeAddress} ellipseBreakpoint="md" />
);
