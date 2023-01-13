import Box from '@mui/material/Box';
import { Story as StoryType, addDecorator } from '@storybook/react';
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from 'react-query';
import { HashRouter } from 'react-router-dom';
import { Token } from 'types';

import setCachedTokenAllowanceToMax from 'clients/api/queries/getAllowance/setCachedTokenAllowanceToMax';
import { Web3Wrapper } from 'clients/web3';
import { AuthContext, AuthContextValue } from 'context/AuthContext';
import { MuiThemeProvider } from 'theme/MuiThemeProvider';

export type DecoratorFunction = Parameters<typeof addDecorator>[0];

export const withRouter: DecoratorFunction = Story => (
  <HashRouter>
    <Story />
  </HashRouter>
);

export const withWeb3Provider: DecoratorFunction = Story => (
  <Web3Wrapper>
    <Story />
  </Web3Wrapper>
);

export const withAuthContext = (context: AuthContextValue) => (Story: StoryType) =>
  (
    <AuthContext.Provider value={context}>
      <Story />
    </AuthContext.Provider>
  );

export const withThemeProvider: DecoratorFunction = Story => (
  <MuiThemeProvider>
    <Story />
  </MuiThemeProvider>
);

export const withQueryClientProvider: DecoratorFunction = Story => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: Infinity,
        staleTime: Infinity,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Story />
    </QueryClientProvider>
  );
};

export const withEnabledToken =
  ({
    token,
    spenderAddress,
    accountAddress,
  }: {
    token: Token;
    spenderAddress: string;
    accountAddress: string;
  }) =>
  (Story: StoryType) => {
    const queryClient = useQueryClient();

    // Update cache to set token as enabled
    setCachedTokenAllowanceToMax({ queryClient, token, spenderAddress, accountAddress });

    return (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    );
  };

export const withCenterStory: (props: {
  width?: number | string;
  height?: number | string;
}) => DecoratorFunction = props => {
  const { width, height } = props;
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
      <Box sx={{ flexShrink: 0, maxWidth: width, width: '100%', height }}>
        <Story />
      </Box>
    </Box>
  );
};

export const withOnChange: (
  pickValue: (event: React.ChangeEvent<any>) => unknown,
) => DecoratorFunction = pickValue => (Story, options) => {
  const [v, onChange] = useState(options.parameters.args.value);
  options.parameters.args.value = v;
  options.parameters.args.onChange = (event: React.ChangeEvent) => onChange(pickValue(event));
  return Story(options);
};
