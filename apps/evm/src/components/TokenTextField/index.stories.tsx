import type { Meta } from '@storybook/react';
import { ChainId, tokens } from '@venusprotocol/chains';
import noop from 'noop-ts';
import { State } from 'react-powerplug';

import { TokenTextField } from '.';

const token = tokens[ChainId.BSC_TESTNET][0];

export default {
  title: 'Components/TokenTextField',
  component: TokenTextField,
} as Meta<typeof TokenTextField>;

const initialData: { value: string } = { value: '1234' };

export const Default = () => (
  <State initial={initialData}>
    {({ state, setState }) => (
      <TokenTextField token={token} value={state.value} onChange={value => setState({ value })} />
    )}
  </State>
);

export const WithTokenPriceCents = () => (
  <State initial={initialData}>
    {({ state, setState }) => (
      <TokenTextField
        token={token}
        value={state.value}
        tokenPriceCents={100}
        onChange={value => setState({ value })}
      />
    )}
  </State>
);

export const WithMaxTokens = () => (
  <State initial={initialData}>
    {({ state, setState }) => (
      <TokenTextField
        token={token}
        value={state.value}
        onChange={value => setState({ value })}
        max="10"
      />
    )}
  </State>
);

export const WithRightMaxButtonLabel = () => (
  <State initial={initialData}>
    {({ state, setState }) => (
      <TokenTextField
        token={token}
        value={state.value}
        onChange={value => setState({ value })}
        max="10"
        rightMaxButton={{
          label: '80% limit',
          onClick: noop,
        }}
      />
    )}
  </State>
);
