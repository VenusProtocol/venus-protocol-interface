import { Meta } from '@storybook/react';
import React from 'react';
import { State } from 'react-powerplug';

import { withCenterStory, withThemeProvider } from 'stories/decorators';

import { Toggle } from '.';

export default {
  title: 'Components/Toggle',
  component: Toggle,
  decorators: [withCenterStory({ width: 400 }), withThemeProvider],
} as Meta<typeof Toggle>;

const initialState: { value: boolean } = {
  value: false,
};

export const Default = () => (
  <State initial={initialState}>
    {({ state, setState }) => (
      <Toggle onChange={e => setState({ value: e.currentTarget.checked })} value={state.value} />
    )}
  </State>
);

export const WithIsLight = () => (
  <State initial={initialState}>
    {({ state, setState }) => (
      <Toggle
        onChange={e => setState({ value: e.currentTarget.checked })}
        value={state.value}
        isLight
      />
    )}
  </State>
);

export const WithTooltipAndLabel = () => (
  <State initial={initialState}>
    {({ state, setState }) => (
      <Toggle
        onChange={e => setState({ value: e.currentTarget.checked })}
        value={state.value}
        isLight
        tooltip="Fake tooltip"
        label="Fake label"
      />
    )}
  </State>
);
