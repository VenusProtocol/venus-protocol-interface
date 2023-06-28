import { Meta, StoryFn } from '@storybook/react';
import noop from 'noop-ts';
import React from 'react';

import { withCenterStory, withOnChange } from 'stories/decorators';

import MarkdownEditor, { MarkdownEditorProps } from '.';

export default {
  title: 'Components/Markdown/Editor',
  component: MarkdownEditor,
  decorators: [withCenterStory({ width: 600 }), withOnChange(string => string)],
} as Meta<typeof MarkdownEditor>;

const Template: StoryFn<MarkdownEditorProps> = (args: MarkdownEditorProps) => (
  <MarkdownEditor {...args} />
);

export const Default = Template.bind({});

Default.args = {
  onChange: noop,
  value:
    "# Default Example\n## Markdown\nIs the best\nThis markdown has an image but it isn't allowed ![alt text](https://cdn.mos.cms.futurecdn.net/RifjtkFLBEFgzkZqWEh69P-1024-80.jpg)",
};
