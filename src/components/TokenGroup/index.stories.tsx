import { Meta } from '@storybook/react';
import React from 'react';
import { Token } from 'types';

import { TESTNET_TOKENS } from 'constants/tokens';
import { withCenterStory } from 'stories/decorators';

import { TokenGroup } from '.';

export default {
  title: 'Components/TokenGroup',
  component: TokenGroup,
  decorators: [withCenterStory({ width: 600 })],
} as Meta<typeof TokenGroup>;

const tokens: Token[] = [
  TESTNET_TOKENS.usdt,
  TESTNET_TOKENS.eth,
  TESTNET_TOKENS.usdc,
  TESTNET_TOKENS.xrp,
  TESTNET_TOKENS.bnb,
  TESTNET_TOKENS.aave,
];

export const Default = () => <TokenGroup tokens={tokens} />;

export const WithLimit = () => <TokenGroup tokens={tokens} limit={3} />;
