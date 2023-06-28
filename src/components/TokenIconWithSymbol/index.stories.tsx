import { Meta } from '@storybook/react';
import React from 'react';

import { TOKENS } from 'constants/tokens';
import { withCenterStory } from 'stories/decorators';

import { TokenIconWithSymbol } from '.';

export default {
  title: 'Components/TokenIconWithSymbol',
  component: TokenIconWithSymbol,
  decorators: [withCenterStory({ width: '100px' })],
} as Meta<typeof TokenIconWithSymbol>;

export const Default = () => <TokenIconWithSymbol token={TOKENS.xvs} />;
