import React from 'react';
import { ComponentMeta, Story } from '@storybook/react';
import noop from 'noop-ts';
import { withCenterStory, withOnChange } from 'stories/decorators';
import MarkdownEditor, { IMarkdownProps } from '.';

export default {
  title: 'Components/Markdown/Editor',
  component: MarkdownEditor,
  decorators: [withCenterStory({ width: 600 }), withOnChange(string => string)],
} as ComponentMeta<typeof MarkdownEditor>;

const Template: Story<IMarkdownProps> = (args: IMarkdownProps) => <MarkdownEditor {...args} />;

export const Default = Template.bind({});

Default.args = {
  onChange: noop,
  value: '# Default Example\n## Markdown\nIs the best',
};
