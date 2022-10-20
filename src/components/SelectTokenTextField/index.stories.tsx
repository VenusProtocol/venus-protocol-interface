import { ComponentMeta } from '@storybook/react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import React from 'react';
import { State } from 'react-powerplug';
import { Token } from 'types';

import { TESTNET_PANCAKE_SWAP_TOKENS } from 'constants/tokens';
import { withCenterStory } from 'stories/decorators';

import { SelectTokenTextField } from '.';

export default {
  title: 'Components/SelectTokenTextField',
  component: SelectTokenTextField,
  decorators: [withCenterStory({ width: 600 })],
} as ComponentMeta<typeof SelectTokenTextField>;

const tokens = [
  TESTNET_PANCAKE_SWAP_TOKENS.busd,
  TESTNET_PANCAKE_SWAP_TOKENS.cake,
  TESTNET_PANCAKE_SWAP_TOKENS.wbnb,
] as Token[];

const initialData: { value: string; token: Token } = {
  value: '',
  token: tokens[0],
};

export const Default = () => (
  <State initial={initialData}>
    {({ state, setState }) => (
      <SelectTokenTextField
        selectedTokenId={state.tokenId}
        value={state.value}
        onChange={value => setState({ value })}
        onChangeSelectedTokenId={tokenId => setState({ tokenId })}
        tokenIds={tokenIds}
      />
    )}
  </State>
);

export const WithUserTokenBalance = () => (
  <State initial={initialData}>
    {({ state, setState }) => (
      <SelectTokenTextField
        selectedTokenId={state.tokenId}
        userTokenBalanceWei={new BigNumber('10000000000000')}
        value={state.value}
        onChange={value => setState({ value })}
        onChangeSelectedTokenId={tokenId => setState({ tokenId })}
        tokenIds={tokenIds}
      />
    )}
  </State>
);

export const Disabled = () => (
  <SelectTokenTextField
    selectedTokenId={tokenIds[0]}
    value=""
    onChange={noop}
    onChangeSelectedTokenId={noop}
    tokenIds={tokenIds}
    disabled
  />
);
