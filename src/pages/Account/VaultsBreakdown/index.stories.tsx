import { ComponentMeta } from '@storybook/react';
import React from 'react';

import { vaults } from '__mocks__/models/vaults';
import { withCenterStory, withRouter } from 'stories/decorators';
import { PALETTE } from 'theme/MuiThemeProvider/muiTheme';

import VaultsBreakdown from '.';

export default {
  title: 'Pages/Account/VaultsBreakdown',
  component: VaultsBreakdown,
  decorators: [withRouter, withCenterStory({ width: 1200 })],
  parameters: {
    backgrounds: {
      default: PALETTE.background.default,
    },
  },
} as ComponentMeta<typeof VaultsBreakdown>;

export const Default = () => <VaultsBreakdown vaults={vaults} />;
