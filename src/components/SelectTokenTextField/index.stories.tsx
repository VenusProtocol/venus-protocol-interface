import { ComponentMeta } from '@storybook/react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import React from 'react';
import { State } from 'react-powerplug';
import { TokenId } from 'types';

import { withCenterStory } from 'stories/decorators';

import { SelectTokenTextField, TokenBalance } from '.';

export default {
  title: 'Components/SelectTokenTextField',
  component: SelectTokenTextField,
  decorators: [withCenterStory({ width: 600 })],
} as ComponentMeta<typeof SelectTokenTextField>;

const fakeTokenBalances: TokenBalance[] = [
  {
    tokenId: 'usdt',
    balanceWei: new BigNumber('10000000000'),
  },
  {
    tokenId: 'xvs',
    balanceWei: new BigNumber('0'),
  },
  {
    tokenId: 'bnb',
    balanceWei: new BigNumber('1000000000000'),
  },
  {
    tokenId: 'usdc',
    balanceWei: new BigNumber('10000000000'),
  },
  {
    tokenId: 'vrt',
    balanceWei: new BigNumber('0'),
  },
  {
    tokenId: 'vai',
    balanceWei: new BigNumber('1000000000000000'),
  },
  {
    tokenId: 'ltc',
    balanceWei: new BigNumber('0'),
  },
  {
    tokenId: 'btcb',
    balanceWei: new BigNumber('0'),
  },
];

const initialData: { value: string; tokenId: TokenId } = {
  value: '',
  tokenId: fakeTokenBalances[0].tokenId,
};

export const Default = () => (
  <State initial={initialData}>
    {({ state, setState }) => (
      <SelectTokenTextField
        tokenId={state.tokenId}
        value={state.value}
        onChange={value => setState({ value })}
        onChangeSelectedToken={tokenId => setState({ tokenId })}
        tokenBalances={fakeTokenBalances}
      />
    )}
  </State>
);

export const Disabled = () => (
  <SelectTokenTextField
    tokenId={fakeTokenBalances[0].tokenId}
    value=""
    onChange={noop}
    // TODO: wire up
    onChangeSelectedToken={console.log}
    tokenBalances={fakeTokenBalances}
    disabled
  />
);
