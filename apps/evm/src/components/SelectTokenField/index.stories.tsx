import type { Meta } from '@storybook/react';
import noop from 'noop-ts';
import { State } from 'react-powerplug';

import { busd, wbnb, xvs } from '__mocks__/models/tokens';

import type { Token } from 'types';

import { SelectTokenField } from '.';

export default {
  title: 'Components/SelectTokenField',
  component: SelectTokenField,
} as Meta<typeof SelectTokenField>;

const tokens: Token[] = [busd, xvs, wbnb];

const initialData: { value: string; token: Token } = {
  value: '',
  token: tokens[0],
};

export const Default = () => (
  <State initial={initialData}>
    {({ state, setState }) => (
      <SelectTokenField
        selectedToken={state.token}
        onChangeSelectedToken={token => setState({ token })}
        tokens={tokens}
      />
    )}
  </State>
);

export const Disabled = () => (
  <SelectTokenField
    selectedToken={tokens[0]}
    onChangeSelectedToken={noop}
    tokens={tokens}
    disabled
  />
);
