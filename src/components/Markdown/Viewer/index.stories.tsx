import { Meta } from '@storybook/react';
import React from 'react';

import { withCenterStory, withOnChange } from 'stories/decorators';

import MarkdownViewer from '.';

export default {
  title: 'Components/Markdown/Viewer',
  component: MarkdownViewer,
  decorators: [withCenterStory({ width: 250 }), withOnChange(e => e.target.checked)],
} as Meta<typeof MarkdownViewer>;

export const Default = () => (
  <MarkdownViewer content="This markdown has an image but it isn't allowed ![alt text](https://cdn.mos.cms.futurecdn.net/RifjtkFLBEFgzkZqWEh69P-1024-80.jpg)" />
);
