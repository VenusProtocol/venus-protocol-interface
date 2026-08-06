import type { Meta } from '@storybook/react';
import { ChainId, tokens } from '@venusprotocol/chains';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import { State } from 'react-powerplug';

import type { Token, TokenBalance } from 'types';

import { SelectTokenTextField } from '.';

const chainTokens = tokens[ChainId.BSC_TESTNET];

export default {
  title: 'Components/SelectTokenTextField',
  component: SelectTokenTextField,
} as Meta<typeof SelectTokenTextField>;

const tokenBalances: TokenBalance[] = [
  {
    token: chainTokens[0],
    balanceMantissa: new BigNumber('1000000000000'),
  },
  {
    token: chainTokens[1],
    balanceMantissa: new BigNumber('2000000000000'),
  },
  {
    token: chainTokens[2],
    balanceMantissa: new BigNumber('3000000000000'),
  },
];

const testId = 'select-token-text-field';

const initialData: { value: string; token: Token } = {
  value: '',
  token: tokenBalances[0].token,
};

const moreTokenBalances: TokenBalance[] = chainTokens.slice(0, 6).map((token, index) => ({
  token,
  balanceMantissa: new BigNumber(`${index + 1}000000000000`),
}));

export const Default = () => (
  <State initial={initialData}>
    {({ state, setState }) => (
      <SelectTokenTextField
        selectedToken={state.token}
        value={state.value}
        onChange={value => setState({ value })}
        onChangeSelectedToken={token => setState({ token })}
        tokenBalances={tokenBalances}
        data-testid={testId}
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
    data-testid={testId}
  />
);

export const SingleToken = () => (
  <SelectTokenTextField
    selectedToken={tokenBalances[0].token}
    value="42"
    onChange={noop}
    onChangeSelectedToken={noop}
    tokenBalances={[tokenBalances[0]]}
    data-testid={testId}
  />
);

export const WithMaxButtonAndDescription = () => (
  <SelectTokenTextField
    selectedToken={tokenBalances[1].token}
    value="100"
    onChange={noop}
    onChangeSelectedToken={noop}
    tokenBalances={tokenBalances}
    rightMaxButton={{ label: 'MAX', onClick: noop }}
    description="Available balance: 2,000 tokens"
    data-testid={testId}
  />
);

export const WithCommonTokenButtons = () => (
  <SelectTokenTextField
    selectedToken={moreTokenBalances[0].token}
    value=""
    onChange={noop}
    onChangeSelectedToken={noop}
    tokenBalances={moreTokenBalances}
    displayCommonTokenButtons
    data-testid={testId}
  />
);
