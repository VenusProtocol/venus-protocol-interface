import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { addDecorator } from '@storybook/react';
import { Provider } from 'react-redux';
import { store } from 'core/store';
import { Web3ReactProvider } from '@web3-react/core';
import Box from '@mui/material/Box';
import { getLibrary } from 'utilities/connectors';
import Web3ReactManager from 'utilities/Web3ReactManager';
import { MarketContextProvider } from 'context/MarketContext';
import { VaiContextProvider } from 'context/VaiContext';
import Theme from 'containers/Theme';
// resolves mui theme issue in storybook https://github.com/mui/material-ui/issues/24282#issuecomment-952211989
import { ThemeProvider as EmotionThemeProvider } from 'emotion-theming';
import mainTheme from 'theme/MuiThemeProvider/muiTheme';
import { MuiThemeProvider } from 'theme/MuiThemeProvider/MuiThemeProvider';

type DecoratorFunction = Parameters<typeof addDecorator>[0];

export const withRouter: DecoratorFunction = Story => (
  <BrowserRouter>
    <Story />
  </BrowserRouter>
);

export const withProvider: DecoratorFunction = Story => (
  <Provider store={store}>
    <Story />
  </Provider>
);

export const withWeb3Provider: DecoratorFunction = Story => (
  <Web3ReactProvider getLibrary={getLibrary}>
    <Web3ReactManager>
      <Story />
    </Web3ReactManager>
  </Web3ReactProvider>
);

export const withMarketContext: DecoratorFunction = Story => (
  <MarketContextProvider>
    <Story />
  </MarketContextProvider>
);

export const withVaiContext: DecoratorFunction = Story => (
  <VaiContextProvider>
    <Story />
  </VaiContextProvider>
);

export const withThemeProvider: DecoratorFunction = Story => (
  <Theme>
    {/* resolves mui theme issue in storybook https://github.com/mui/material-ui/issues/24282#issuecomment-952211989 */}
    <EmotionThemeProvider theme={mainTheme}>
      <MuiThemeProvider>
        <Story />
      </MuiThemeProvider>
    </EmotionThemeProvider>
  </Theme>
);

export const withCenterStory: (props: { width: number }) => DecoratorFunction = props => {
  const { width } = props;
  return Story => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
      }}
    >
      <Box sx={{ flexShrink: 0, width }}>
        <Story />
      </Box>
    </Box>
  );
};
