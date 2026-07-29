import type { Meta, StoryObj } from '@storybook/react';
import noop from 'noop-ts';
import { State } from 'react-powerplug';

import { Checkbox } from '.';

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
  args: {
    onChange: noop,
    value: false,
  },
} as Meta<typeof Checkbox>;

type Story = StoryObj<typeof Checkbox>;

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

export const Unchecked: Story = {};

export const Checked: Story = {
  args: {
    value: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    value: true,
  },
};
