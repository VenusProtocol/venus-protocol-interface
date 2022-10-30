import { ComponentMeta } from '@storybook/react';
import React from 'react';

import TEST_TOKENS from '__mocks__/models/tokens';
import { withCenterStory } from 'stories/decorators';

import { TokenIcon } from '.';

export default {
  title: 'Components/TokenIcon',
  component: TokenIcon,
  decorators: [withCenterStory({ width: 100 })],
} as ComponentMeta<typeof TokenIcon>;

export const Default = () => <TokenIcon token={TEST_TOKENS.usdc} />;
