import { Meta } from '@storybook/react';

import { bnb, eth, lisUsd, usdc, usdt, xvs } from '__mocks__/models/tokens';

import { withCenterStory } from 'stories/decorators';
import { Token } from 'types';

import { TokenGroup } from '.';

export default {
  title: 'Components/TokenGroup',
  component: TokenGroup,
  decorators: [withCenterStory({ width: 600 })],
} as Meta<typeof TokenGroup>;

const tokens: Token[] = [usdt, eth, usdc, xvs, bnb, lisUsd];

export const Default = () => <TokenGroup tokens={tokens} />;

export const WithLimit = () => <TokenGroup tokens={tokens} limit={3} />;
