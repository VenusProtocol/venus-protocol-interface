import type { Meta } from '@storybook/react';

import { Delimiter } from '.';

export default {
  title: 'Components/Delimiter',
  component: Delimiter,
} as Meta<typeof Delimiter>;

export const Default = () => (
  <>
    Some text
    <Delimiter />
    and some more text
  </>
);
