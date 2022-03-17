import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withThemeProvider } from 'stories/decorators';
import { Footer } from '.';

export default {
  title: 'Components/Layout/Footer',
  component: Footer,
  decorators: [withThemeProvider],
} as ComponentMeta<typeof Footer>;

export const FooterDefault = () => <Footer currentBlockNumber={123456789} />;
