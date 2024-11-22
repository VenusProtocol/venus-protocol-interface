import type { Meta } from '@storybook/react';

import { xvs } from '__mocks__/models/tokens';

import { TokenIconWithSymbol } from '.';

export default {
  title: 'Components/TokenIconWithSymbol',
  component: TokenIconWithSymbol,
} as Meta<typeof TokenIconWithSymbol>;

export const Default = () => <TokenIconWithSymbol token={xvs} />;
