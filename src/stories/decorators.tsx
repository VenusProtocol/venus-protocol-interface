import Box from '@mui/material/Box';
import { StoryFn } from '@storybook/react';
import { QueryClient, QueryClientProvider, useQueryClient } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { Token } from 'types';

import { GetAllowanceOutput } from 'clients/api';
import { UseGetAllowanceQueryKey } from 'clients/api/queries/getAllowance/useGetAllowance';
import { Web3Wrapper } from 'clients/web3';
import FunctionKey from 'constants/functionKey';
import MAX_UINT256 from 'constants/maxUint256';
import { AuthContext, AuthContextValue } from 'context/AuthContext';
import { MuiThemeProvider } from 'theme/MuiThemeProvider';

export const withRouter = (Story: StoryFn) => (
  <BrowserRouter>
    <Story />
  </BrowserRouter>
);

export const withWeb3Provider = (Story: StoryFn) => (
  <Web3Wrapper>
    <Story />
  </Web3Wrapper>
);

export const withAuthContext = (context: AuthContextValue) => (Story: StoryFn) => (
  <AuthContext.Provider value={context}>
    <Story />
  </AuthContext.Provider>
);

export const withThemeProvider = (Story: StoryFn) => (
  <MuiThemeProvider>
    <Story />
  </MuiThemeProvider>
);

export const withQueryClientProvider = (Story: StoryFn) => {
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

export const withApprovedToken =
  ({
    token,
    spenderAddress,
    accountAddress,
  }: {
    token: Token;
    spenderAddress: string;
    accountAddress: string;
  }) =>
  (Story: StoryFn) => {
    const queryClient = useQueryClient();

    // Update cache to set token as enabled
    const queryKey: UseGetAllowanceQueryKey = [
      FunctionKey.GET_TOKEN_ALLOWANCE,
      {
        tokenAddress: token.address,
        spenderAddress,
        accountAddress,
      },
    ];

    queryClient.setQueryData<GetAllowanceOutput>(queryKey, {
      allowanceWei: MAX_UINT256,
    });

    return (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    );
  };

export const withCenterStory: (props: {
  width?: number | string;
  height?: number | string;
}) => unknown = props => {
  const { width, height } = props;

  return (Story: StoryFn) => (
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
