/** @jsxImportSource @emotion/react */
import { Meta } from '@storybook/react';
import React from 'react';
import { State } from 'react-powerplug';

import { withCenterStory } from 'stories/decorators';

import { Checkbox } from '.';

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
  decorators: [withCenterStory({ width: 250 })],
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
