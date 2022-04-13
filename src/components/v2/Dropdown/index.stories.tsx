import React from 'react';
import { ComponentMeta } from '@storybook/react';

import { withCenterStory } from 'stories/decorators';
import { getToken } from 'utilities';
import { VBEP_TOKENS } from 'constants/tokens';
import { TokenSymbol } from 'types';
import { Dropdown } from '.';

export default {
  title: 'Components/Dropdown',
  component: Dropdown,
  decorators: [withCenterStory({ width: 137 })],
} as ComponentMeta<typeof Dropdown>;

const assets = Object.keys(VBEP_TOKENS).map(id => ({
  value: id,
  label: getToken(id as TokenSymbol).symbol || id,
  img: getToken(id as TokenSymbol).asset,
}));

export const DropdownDefault = () => (
  <Dropdown options={assets} defaultValue={assets[0]} onSelect={console.log} />
);
