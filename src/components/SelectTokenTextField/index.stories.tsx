import { ComponentMeta } from '@storybook/react';
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
];

const initialData: { value: string; token: Token } = {
  value: '',
  token: tokens[0],
};

export const Default = () => (
  <State initial={initialData}>
    {({ state, setState }) => (
      <SelectTokenTextField
        selectedToken={state.token}
        value={state.value}
        onChange={value => setState({ value })}
        onChangeSelectedToken={token => setState({ token })}
        tokens={tokens}
      />
    )}
  </State>
);

export const Disabled = () => (
  <SelectTokenTextField
    selectedToken={tokens[0]}
    value=""
    onChange={noop}
    onChangeSelectedToken={noop}
    tokens={tokens}
    disabled
  />
);
