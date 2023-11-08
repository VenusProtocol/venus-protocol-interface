import { Meta } from '@storybook/react';
import React from 'react';
import { State } from 'react-powerplug';

import { withCenterStory } from 'stories/decorators';

import { Select } from '.';

export default {
  title: 'Components/Select',
  component: Select,
  decorators: [withCenterStory({ width: 200 })],
} as Meta<typeof Select>;

const options = Array.from(Array(5).keys()).map(i => ({
  value: `value${i}`,
  label: `Value${i}`,
}));

const initialState: { value: string | number } = {
  value: 'value1',
};

export const Default = () => (
  <State initial={initialState}>
    {({ state, setState }) => (
      <Select value={state.value} onChange={value => setState({ value })} options={options} />
    )}
  </State>
);

export const WithLabel = () => (
  <State initial={initialState}>
    {({ state, setState }) => (
      <Select
        value={state.value}
        onChange={value => setState({ value })}
        options={options}
        label="Filter by:"
      />
    )}
  </State>
);

export const WithLeftLabel = () => (
  <State initial={initialState}>
    {({ state, setState }) => (
      <Select
        value={state.value}
        onChange={value => setState({ value })}
        options={options}
        label="Filter by:"
        placeLabelToLeft
      />
    )}
  </State>
);
