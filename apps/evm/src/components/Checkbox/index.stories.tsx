/** @jsxImportSource @emotion/react */
import type { Meta } from '@storybook/react';
import { State } from 'react-powerplug';

import { Checkbox } from '.';

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
} as Meta<typeof Checkbox>;

const initialState: { value: boolean } = {
  value: false,
};

export const Default = () => (
  <State initial={initialState}>
    {({ state, setState }) => (
      <Checkbox onChange={e => setState({ value: e.currentTarget.checked })} value={state.value} />
    )}
  </State>
);
