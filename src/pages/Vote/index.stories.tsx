import { ComponentMeta } from '@storybook/react';
import React from 'react';
import { State } from 'react-powerplug';

import { withRouter } from 'stories/decorators';

import { VoteUi } from '.';

export default {
  title: 'Pages/Vote',
  component: VoteUi,
  decorators: [withRouter],
} as ComponentMeta<typeof VoteUi>;

const initialData: { value: number } = { value: 0 };

export const Default = () => (
  <State initial={initialData}>
    {({ state, setState }) => (
      <VoteUi currentPage={state.value} setCurrentPage={value => setState({ value })} />
    )}
  </State>
);
