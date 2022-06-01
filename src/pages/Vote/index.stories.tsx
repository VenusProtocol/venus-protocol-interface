import React from 'react';
import { ComponentMeta } from '@storybook/react';
import Vote from '.';

export default {
  title: 'Pages/Vote',
  component: Vote,
} as ComponentMeta<typeof Vote>;

export const Default = () => <Vote />;
