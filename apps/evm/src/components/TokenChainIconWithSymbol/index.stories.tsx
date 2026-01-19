import type { Meta } from '@storybook/react';

import { ChainId, chains } from '@venusprotocol/chains';
import { xvs } from '__mocks__/models/tokens';

import { TokenChainIconWithSymbol } from '.';

export default {
  title: 'Components/TokenIconWithSymbol',
  component: TokenChainIconWithSymbol,
} as Meta<typeof TokenChainIconWithSymbol>;

export const Default = () => (
  <TokenChainIconWithSymbol token={xvs} chain={chains[ChainId.BSC_MAINNET]} />
);
