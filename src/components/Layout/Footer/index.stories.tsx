import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { FooterUi } from '.';

export default {
  title: 'Components/Layout/Footer',
  component: FooterUi,
} as ComponentMeta<typeof FooterUi>;

export const FooterDefault = () => <FooterUi currentBlockNumber={14378407} />;
