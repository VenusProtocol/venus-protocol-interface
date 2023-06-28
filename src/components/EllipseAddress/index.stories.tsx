import { Meta } from '@storybook/react';
import React from 'react';

import fakeAddress from '__mocks__/models/address';
import { withCenterStory } from 'stories/decorators';

import { EllipseAddress } from '.';

export default {
  title: 'Components/ApproveToken',
  component: EllipseAddress,
  decorators: [withCenterStory({ width: 450 })],
} as Meta<typeof EllipseAddress>;

export const Default = () => <EllipseAddress address={fakeAddress} />;

export const WithEllipseBreakpoint = () => (
  <EllipseAddress address={fakeAddress} ellipseBreakpoint="md" />
);
