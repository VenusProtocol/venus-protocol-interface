import type { Meta, StoryObj } from '@storybook/react';

import { Toggle } from '.';

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
} satisfies Meta<typeof Toggle>;

export default meta;

type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  args: {
    value: false,
  },
};

export const Checked: Story = {
  args: {
    value: true,
  },
};

export const WithIsDark: Story = {
  args: {
    isDark: true,
    value: false,
  },
};

export const WithIsDarkChecked: Story = {
  args: {
    isDark: true,
    value: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: false,
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    value: true,
  },
};

export const WithTooltipAndLabel: Story = {
  args: {
    label: 'Fake label',
    tooltip: 'Fake tooltip',
    value: false,
  },
};

export const WithTooltipAndLabelChecked: Story = {
  args: {
    label: 'Fake label',
    tooltip: 'Fake tooltip',
    value: true,
  },
};
