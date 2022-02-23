import React from 'react';
import { ComponentMeta } from '@storybook/react';
import {
  withRouter,
  withProvider,
  withWeb3Provider,
  withMarketContext,
  withVaiContext,
  withThemeProvider,
} from 'stories/decorators';
import Box from '@mui/material/Box';
import { CONTRACT_TOKEN_ADDRESS, CONTRACT_VBEP_ADDRESS } from 'utilities/constants';
import { Dropdown } from '.';

export default {
  title: 'Dropdown',
  component: Dropdown,
  decorators: [
    withRouter,
    withProvider,
    withWeb3Provider,
    withMarketContext,
    withVaiContext,
    withThemeProvider,
  ],
} as ComponentMeta<typeof Dropdown>;

const assets = Object.keys(CONTRACT_VBEP_ADDRESS).map(id => ({
  value: id,
  label: CONTRACT_TOKEN_ADDRESS[id as (keyof typeof CONTRACT_TOKEN_ADDRESS)]?.symbol || id,
  img: CONTRACT_TOKEN_ADDRESS[id as (keyof typeof CONTRACT_TOKEN_ADDRESS)]?.asset,
}));

export const DropdownDefault = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100vh',
    }}
  >
    <Box sx={{ flexShrink: 0, width: 137 }}>
      <Dropdown options={assets} defaultValue={assets[0]} onSelect={console.log} />
    </Box>
  </Box>
);
