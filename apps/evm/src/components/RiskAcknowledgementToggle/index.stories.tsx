import type { Meta } from '@storybook/react';
import { State } from 'react-powerplug';

import { RiskAcknowledgementToggle } from '.';

export default {
  title: 'Components/RiskAcknowledgementToggle',
  component: RiskAcknowledgementToggle,
} as Meta<typeof RiskAcknowledgementToggle>;

const initialState: { value: boolean } = {
  value: false,
};

export const Default = () => (
  <State initial={initialState}>
    {({ state, setState }) => (
      <RiskAcknowledgementToggle
        value={state.value}
        onChange={(_event, value) => setState({ value })}
      />
    )}
  </State>
);
