import type { Meta } from '@storybook/react';

import fakeAddress from '__mocks__/models/address';

import { EllipseAddress } from '.';

export default {
  title: 'Components/EllipseAddress',
  component: EllipseAddress,
} as Meta<typeof EllipseAddress>;

export const Default = () => <EllipseAddress address={fakeAddress} />;

export const WithEllipseBreakpoint = () => (
  <EllipseAddress address={fakeAddress} ellipseBreakpoint="md" />
);
