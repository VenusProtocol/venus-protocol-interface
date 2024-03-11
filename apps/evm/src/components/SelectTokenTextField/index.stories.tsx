import type { Meta } from '@storybook/react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import { State } from 'react-powerplug';

import { busd, wbnb, xvs } from '__mocks__/models/tokens';

import { withCenterStory } from 'stories/decorators';
import type { Token, TokenBalance } from 'types';

import { SelectTokenTextField } from '.';

export default {
  title: 'Components/SelectTokenTextField',
  component: SelectTokenTextField,
  decorators: [withCenterStory({ width: 600 })],
} as Meta<typeof SelectTokenTextField>;

const tokenBalances: TokenBalance[] = [
  {
    token: busd,
    balanceMantissa: new BigNumber('1000000000000'),
  },
  {
    token: xvs,
    balanceMantissa: new BigNumber('2000000000000'),
  },
  {
    token: wbnb,
    balanceMantissa: new BigNumber('3000000000000'),
  },
];

const initialData: { value: string; token: Token } = {
  value: '',
  token: tokenBalances[0].token,
};

export const Default = () => (
  <State initial={initialData}>
    {({ state, setState }) => (
      <SelectTokenTextField
        selectedToken={state.token}
        value={state.value}
        onChange={value => setState({ value })}
        onChangeSelectedToken={token => setState({ token })}
        tokenBalances={tokenBalances}
      />
    )}
  </State>
);

export const Disabled = () => (
  <SelectTokenTextField
    selectedToken={tokenBalances[0].token}
    value=""
    onChange={noop}
    onChangeSelectedToken={noop}
    tokenBalances={tokenBalances}
    disabled
  />
);
