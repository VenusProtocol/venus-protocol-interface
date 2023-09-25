import { Meta } from '@storybook/react';
import React from 'react';
import { Token } from 'types';

import { bnb, eth, hay, usdc, usdt, xvs } from '__mocks__/models/tokens';
import { withCenterStory } from 'stories/decorators';

import { TokenGroup } from '.';

export default {
  title: 'Components/TokenGroup',
  component: TokenGroup,
  decorators: [withCenterStory({ width: 600 })],
} as Meta<typeof TokenGroup>;

const tokens: Token[] = [usdt, eth, usdc, xvs, bnb, hay];

export const Default = () => <TokenGroup tokens={tokens} />;

export const WithLimit = () => <TokenGroup tokens={tokens} limit={3} />;
