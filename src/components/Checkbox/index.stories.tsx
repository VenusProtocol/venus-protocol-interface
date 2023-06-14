/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Meta, StoryFn } from '@storybook/react';
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
} as Meta<typeof Checkbox>;

const Template: StoryFn<CheckboxProps> = (args: CheckboxProps) => <Checkbox {...args} />;

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
