import type { Meta } from '@storybook/react';

import { bnb, eth, lisUsd, usdc, usdt, xvs } from '__mocks__/models/tokens';

import type { Token } from 'types';

import { TokenGroup } from '.';

export default {
  title: 'Components/TokenGroup',
  component: TokenGroup,
} as Meta<typeof TokenGroup>;

const tokens: Token[] = [usdt, eth, usdc, xvs, bnb, lisUsd];

export const Default = () => <TokenGroup tokens={tokens} />;

export const WithLimit = () => <TokenGroup tokens={tokens} limit={3} />;
