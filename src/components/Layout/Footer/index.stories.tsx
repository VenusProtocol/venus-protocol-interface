import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { Footer } from '.';

export default {
  title: 'Components/Layout/Footer',
  component: Footer,
} as ComponentMeta<typeof Footer>;

export const FooterDefault = () => <Footer currentBlockNumber={14378407} />;
