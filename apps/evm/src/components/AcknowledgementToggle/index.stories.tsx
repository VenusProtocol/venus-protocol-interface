import type { Meta } from '@storybook/react';
import { State } from 'react-powerplug';

import { AcknowledgementToggle } from '.';

export default {
  title: 'Components/AcknowledgementToggle',
  component: AcknowledgementToggle,
} as Meta<typeof AcknowledgementToggle>;

const initialState: { value: boolean } = {
  value: false,
};

export const Default = () => (
  <State initial={initialState}>
    {({ state, setState }) => (
      <AcknowledgementToggle
        tooltip="Fake tooltip"
        label="Fake label"
        value={state.value}
        onChange={(_event, value) => setState({ value })}
      />
    )}
  </State>
);
