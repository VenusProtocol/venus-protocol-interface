import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withCenterStory, withOnChange } from 'stories/decorators';
import { MarkdownViewer } from '.';

export default {
  title: 'Components/Markdown/Viewer',
  component: MarkdownViewer,
  decorators: [withCenterStory({ width: 250 }), withOnChange(e => e.target.checked)],
} as ComponentMeta<typeof MarkdownViewer>;

export const Default = () => <MarkdownViewer content="Content" />;
