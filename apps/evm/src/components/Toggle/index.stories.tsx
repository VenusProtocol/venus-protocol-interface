import type { Meta } from '@storybook/react';
import { State } from 'react-powerplug';

import { Toggle } from '.';

export default {
  title: 'Components/Toggle',
  component: Toggle,
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

export const WithIsDark = () => (
  <State initial={initialState}>
    {({ state, setState }) => (
      <Toggle
        isDark
        onChange={e => setState({ value: e.currentTarget.checked })}
        value={state.value}
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
        tooltip="Fake tooltip"
        label="Fake label"
      />
    )}
  </State>
);
