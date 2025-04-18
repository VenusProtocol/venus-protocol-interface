import '../src/assets/styles/index.css';
import { withPadding, withRouter, withThemeProvider } from '../src/stories/decorators';

import { theme } from '@venusprotocol/ui';
import initializeLibraries from '../src/initializeLibraries';

initializeLibraries();

export const parameters = {
  layout: 'fullscreen',
  backgrounds: {
    default: 'Default',
    values: [
      {
        name: 'Default',
        value: theme.colors.cards,
      },
      {
        name: 'Primary',
        value: theme.colors.background,
      },
      {
        name: 'White',
        value: theme.colors.offWhite,
      },
    ],
  },
};

export const decorators = [withRouter, withThemeProvider, withPadding];
export const tags = ['autodocs'];
