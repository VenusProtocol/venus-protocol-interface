import { ComponentMeta } from '@storybook/react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import React from 'react';
import { State } from 'react-powerplug';
import { TokenId } from 'types';

import { withCenterStory } from 'stories/decorators';

import { SelectTokenTextFieldUi } from '.';

export default {
  title: 'Components/SelectTokenTextField',
  component: SelectTokenTextFieldUi,
  decorators: [withCenterStory({ width: 600 })],
} as ComponentMeta<typeof SelectTokenTextFieldUi>;

const tokenIds: TokenId[] = ['usdt', 'xvs', 'bnb', 'usdc', 'vrt', 'vai', 'ltc', 'btcb'];

const initialData: { value: string; tokenId: TokenId } = {
  value: '',
  tokenId: tokenIds[0],
};

export const Default = () => (
  <State initial={initialData}>
    {({ state, setState }) => (
      <SelectTokenTextFieldUi
        selectedTokenId={state.tokenId}
        value={state.value}
        onChange={value => setState({ value })}
        onChangeSelectedToken={tokenId => setState({ tokenId })}
        tokenIds={tokenIds}
      />
    )}
  </State>
);

export const WithUserTokenBalance = () => (
  <State initial={initialData}>
    {({ state, setState }) => (
      <SelectTokenTextFieldUi
        selectedTokenId={state.tokenId}
        userTokenBalanceWei={new BigNumber('10000000000000')}
        value={state.value}
        onChange={value => setState({ value })}
        onChangeSelectedToken={tokenId => setState({ tokenId })}
        tokenIds={tokenIds}
      />
    )}
  </State>
);

export const Disabled = () => (
  <SelectTokenTextFieldUi
    selectedTokenId={tokenIds[0]}
    value=""
    onChange={noop}
    onChangeSelectedToken={noop}
    tokenIds={tokenIds}
    disabled
  />
);
