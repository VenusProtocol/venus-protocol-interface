import React from 'react';
import { State } from 'react-powerplug';
import { ComponentMeta } from '@storybook/react';
import { withCenterStory } from 'stories/decorators';
import { Tabs } from '.';

export default {
  title: 'Components/Tabs',
  component: Tabs,
  decorators: [withCenterStory({ width: 350 })],
} as ComponentMeta<typeof Tabs>;

export const Default = () => (
  <State initial={{ activeTabIndex: 0 }}>
    {({ state, setState }) => (
      <Tabs
        tabTitles={['Borrow', 'Repay']}
        activeTabIndex={state.activeTabIndex}
        onChange={newActiveTabIndex =>
          setState(existingState => ({
            ...existingState,
            activeTabIndex: newActiveTabIndex,
          }))
        }
      />
    )}
  </State>
);

export const FullWidth = () => (
  <State initial={{ activeTabIndex: 0 }}>
    {({ state, setState }) => (
      <Tabs
        tabTitles={['Borrow', 'Repay']}
        activeTabIndex={state.activeTabIndex}
        onChange={newActiveTabIndex =>
          setState(existingState => ({
            ...existingState,
            activeTabIndex: newActiveTabIndex,
          }))
        }
        fullWidth
      />
    )}
  </State>
);
