import type { Meta } from '@storybook/react';
import { State } from 'react-powerplug';

import { Slider } from '.';

export default {
  title: 'Components/Slider',
  component: Slider,
} as Meta<typeof Slider>;

const initialData: { value: number } = {
  value: 10,
};

export const Default = () => (
  <State initial={initialData}>
    {({ state, setState }) => (
      <Slider value={state.value} onChange={value => setState({ value })} max={100} step={1} />
    )}
  </State>
);
