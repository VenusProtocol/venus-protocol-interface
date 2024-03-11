import type { Meta } from '@storybook/react';
import { State } from 'react-powerplug';

import { withCenterStory } from 'stories/decorators';

import { MarkdownEditor } from '.';

export default {
  title: 'Components/Markdown/Editor',
  component: MarkdownEditor,
  decorators: [withCenterStory({ width: 600 })],
} as Meta<typeof MarkdownEditor>;

const initialState: { value: string } = {
  value:
    "# Default Example\n## Markdown\nIs the best\nThis markdown has an image but it isn't allowed ![alt text](https://cdn.mos.cms.futurecdn.net/RifjtkFLBEFgzkZqWEh69P-1024-80.jpg)",
};

export const Default = () => (
  <State initial={initialState}>
    {({ state, setState }) => (
      <MarkdownEditor
        name="some-markdown"
        placeholder="Write something"
        onChange={newValue => setState({ value: newValue })}
        value={state.value}
      />
    )}
  </State>
);
