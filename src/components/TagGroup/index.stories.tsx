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
        tagsContent={['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5']}
        activeTagIndex={state.activeTagIndex}
        onTagClick={newIndex => setState({ activeTagIndex: newIndex })}
      />
    )}
  </State>
);
