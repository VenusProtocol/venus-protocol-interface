import type { Meta } from '@storybook/react';
import { State } from 'react-powerplug';

import { PALETTE } from 'App/MuiThemeProvider/muiTheme';

import { TagGroup } from '.';

export default {
  title: 'Components/TagGroup',
  component: TagGroup,
  parameters: {
    backgrounds: {
      default: PALETTE.background.default,
    },
  },
} as Meta<typeof TagGroup>;

const initialData: { activeTagIndex: number } = {
  activeTagIndex: 0,
};

export const Default = () => (
  <State initial={initialData}>
    {({ state, setState }) => (
      <TagGroup
        tags={[
          { id: 1, content: 'Tag 1' },
          { id: 2, content: 'Tag 2' },
          { id: 3, content: 'Tag 3' },
          { id: 4, content: 'Tag 4' },
        ]}
        activeTagIndex={state.activeTagIndex}
        onTagClick={newIndex => setState({ activeTagIndex: newIndex })}
      />
    )}
  </State>
);
