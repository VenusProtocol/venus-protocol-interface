import { ComponentMeta } from '@storybook/react';
import noop from 'noop-ts';
import React from 'react';
import { State } from 'react-powerplug';
import { TokenId } from 'types';

import { withCenterStory } from 'stories/decorators';

import { SelectTokenTextField } from '.';

export default {
  title: 'Components/SelectTokenTextField',
  component: SelectTokenTextField,
  decorators: [withCenterStory({ width: 600 })],
} as ComponentMeta<typeof SelectTokenTextField>;

const tokenIds: TokenId[] = ['usdt', 'xvs', 'bnb', 'usdc', 'vrt', 'vai', 'ltc', 'btcb'];

const initialData: { value: string; tokenId: TokenId } = {
  value: '',
  tokenId: tokenIds[0],
};

export const Default = () => (
  <State initial={initialData}>
    {({ state, setState }) => (
      <SelectTokenTextField
        selectedTokenId={state.tokenId}
        value={state.value}
        onChange={value => setState({ value })}
        onChangeSelectedToken={tokenId => setState({ tokenId })}
        tokenIds={tokenIds}
      />
    )}
  </State>
);

export const Disabled = () => (
  <SelectTokenTextField
    tokenId={tokenIds[0]}
    value=""
    onChange={noop}
    onChangeSelectedToken={noop}
    tokenIds={tokenIds}
    disabled
  />
);
