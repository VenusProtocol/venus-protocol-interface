/** @jsxImportSource @emotion/react */
import React from 'react';
import { ComponentMeta, Story } from '@storybook/react';
import { css } from '@emotion/react';
import { withCenterStory, withOnChange } from 'stories/decorators';
import { noop } from 'lodash';
import { Checkbox, ICheckboxProps } from '.';

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

const Template: Story<ICheckboxProps> = (args: ICheckboxProps) => <Checkbox {...args} />;

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

export const SmallChecked = (args: ICheckboxProps) => (
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
