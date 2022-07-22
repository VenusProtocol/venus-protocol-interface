/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { ComponentMeta, Story } from '@storybook/react';
import { noop } from 'lodash';
import React from 'react';

import { withCenterStory, withOnChange } from 'stories/decorators';

import { Checkbox, CheckboxProps } from '.';

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
  decorators: [withCenterStory({ width: 250 }), withOnChange(e => e.target.checked)],
  parameters: {
    backgrounds: {
      default: 'White',
    },
  },
} as ComponentMeta<typeof Checkbox>;

const Template: Story<CheckboxProps> = (args: CheckboxProps) => <Checkbox {...args} />;

export const Checked = Template.bind({});
Checked.args = {
  onChange: noop,
  value: true,
};

export const UnChecked = Template.bind({});
UnChecked.args = {
  onChange: noop,
  value: false,
};

export const SmallChecked = (args: CheckboxProps) => (
  <Checkbox
    {...args}
    css={css`
      svg {
        height: 8px;
        width: 8px;
      }
    `}
  />
);
