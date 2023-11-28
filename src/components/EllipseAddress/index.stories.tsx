import { Meta } from '@storybook/react';

import fakeAddress from '__mocks__/models/address';

import { withCenterStory } from 'stories/decorators';

import { EllipseAddress } from '.';

export default {
  title: 'Components/EllipseAddress',
  component: EllipseAddress,
  decorators: [withCenterStory({ width: 450 })],
} as Meta<typeof EllipseAddress>;

export const Default = () => <EllipseAddress address={fakeAddress} />;

export const WithEllipseBreakpoint = () => (
  <EllipseAddress address={fakeAddress} ellipseBreakpoint="md" />
);
