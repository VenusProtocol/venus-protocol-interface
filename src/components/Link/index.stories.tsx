import { Meta } from '@storybook/react';

import { withCenterStory, withThemeProvider } from 'stories/decorators';

import { Link } from '.';

export default {
  title: 'Components/Link',
  component: Link,
  decorators: [withThemeProvider, withCenterStory({ width: 600 })],
} as Meta<typeof Link>;

export const ExternalLink = () => <Link href="https://google.com">Click me</Link>;

export const InternalLink = () => <Link to="/">Click me</Link>;
