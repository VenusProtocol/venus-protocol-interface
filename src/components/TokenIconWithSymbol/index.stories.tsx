import { Meta } from '@storybook/react';
import React from 'react';

import { xvs } from '__mocks__/models/tokens';

import { withCenterStory } from 'stories/decorators';

import { TokenIconWithSymbol } from '.';

export default {
  title: 'Components/TokenIconWithSymbol',
  component: TokenIconWithSymbol,
  decorators: [withCenterStory({ width: '100px' })],
} as Meta<typeof TokenIconWithSymbol>;

export const Default = () => <TokenIconWithSymbol token={xvs} />;
