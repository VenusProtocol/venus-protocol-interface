import { ComponentMeta } from '@storybook/react';
import React from 'react';
import { TokenId } from 'types';

import { withCenterStory } from 'stories/decorators';

import { TokenGroup } from '.';

export default {
  title: 'Components/TokenGroup',
  component: TokenGroup,
  decorators: [withCenterStory({ width: 600 })],
} as ComponentMeta<typeof TokenGroup>;

const tokenIds: TokenId[] = ['usdt', 'eth', 'usdc', 'xrp', 'bnb', 'aave'];

export const Default = () => <TokenGroup tokenIds={tokenIds} />;

export const WithLimit = () => <TokenGroup tokenIds={tokenIds} limit={3} />;
