import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { addDecorator } from '@storybook/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { store } from 'core/store';
import Box from '@mui/material/Box';
import { Web3Wrapper } from 'clients/web3';
import { MarketContextProvider } from 'context/MarketContext';
import { VaiContextProvider } from 'context/VaiContext';
import Theme from 'theme';
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
  <Web3Wrapper>
    <Story />
  </Web3Wrapper>
);

export const withMarketContext: DecoratorFunction = Story => (
  <MarketContextProvider>
    <Story />
  </MarketContextProvider>
);

export const withVaiContextProvider: DecoratorFunction = Story => (
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

export const withQueryClientProvider: DecoratorFunction = Story => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Story />
    </QueryClientProvider>
  );
};

export const withCenterStory: (props: { width: number | string }) => DecoratorFunction = props => {
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
      <Box sx={{ flexShrink: 0, maxWidth: width, width: '100%' }}>
        <Story />
      </Box>
    </Box>
  );
};

export const withState: DecoratorFunction = (Story, options) => {
  const [v, onChange] = useState(options.parameters.args.value);
  options.parameters.args.value = v;
  options.parameters.args.onChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    onChange(event.target.checked);
  return Story(options);
};
