import { Meta } from '@storybook/react';
import { State } from 'react-powerplug';

import { withRouter } from 'stories/decorators';

import { GovernanceUi } from '.';

export default {
  title: 'Pages/Vote',
  component: GovernanceUi,
  decorators: [withRouter],
} as Meta<typeof GovernanceUi>;

const initialData: { value: number } = { value: 0 };

export const Default = () => (
  <State initial={initialData}>
    {({ state, setState }) => (
      <GovernanceUi currentPage={state.value} setCurrentPage={value => setState({ value })} />
    )}
  </State>
);
