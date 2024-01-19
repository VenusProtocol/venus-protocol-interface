import '../src/assets/styles/index.scss';
import { withRouter, withThemeProvider } from '../src/stories/decorators';

import initializeLibraries from '../src/initializeLibraries';
import { theme } from '../src/theme';

initializeLibraries();

export const parameters = {
  layout: 'fullscreen',
  actions: { argTypesRegex: '^on[A-Z].*' },
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

export const decorators = [withRouter, withThemeProvider];
