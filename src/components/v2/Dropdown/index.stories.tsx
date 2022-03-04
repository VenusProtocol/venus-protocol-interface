import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withThemeProvider, withCenterStory } from 'stories/decorators';
import { CONTRACT_TOKEN_ADDRESS, CONTRACT_VBEP_ADDRESS } from 'utilities/constants';
import { Dropdown } from '.';

export default {
  title: 'Components/Dropdown',
  component: Dropdown,
  decorators: [withThemeProvider, withCenterStory({ width: 137 })],
} as ComponentMeta<typeof Dropdown>;

const assets = Object.keys(CONTRACT_VBEP_ADDRESS).map(id => ({
  value: id,
  label: CONTRACT_TOKEN_ADDRESS[id as keyof typeof CONTRACT_TOKEN_ADDRESS]?.symbol || id,
  img: CONTRACT_TOKEN_ADDRESS[id as keyof typeof CONTRACT_TOKEN_ADDRESS]?.asset,
}));

export const DropdownDefault = () => (
  <Dropdown options={assets} defaultValue={assets[0]} onSelect={console.log} />
);
