import { ComponentMeta } from '@storybook/react';
import React from 'react';
import { State } from 'react-powerplug';

import { withCenterStory } from 'stories/decorators';
import { PALETTE } from 'theme/MuiThemeProvider/muiTheme';

import { TagGroup } from '.';

export default {
  title: 'Components/TagGroup',
  component: TagGroup,
  decorators: [withCenterStory({ width: 1200 })],
  parameters: {
    backgrounds: {
      default: PALETTE.background.default,
    },
  },
} as ComponentMeta<typeof TagGroup>;

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
