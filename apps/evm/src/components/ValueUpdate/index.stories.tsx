import type { Meta } from '@storybook/react';

import { ValueUpdate } from '.';

export default {
  title: 'Components/ValueUpdate',
  component: ValueUpdate,
} as Meta<typeof ValueUpdate>;

export const Increase = () => <ValueUpdate original={200000} update={300000} />;

export const Decrease = () => <ValueUpdate original={500000} update={300000} />;

export const Same = () => <ValueUpdate original={500000} update={500000} />;
