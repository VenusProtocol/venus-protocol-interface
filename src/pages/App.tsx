import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import { queryClient } from 'clients/api';
import { Web3Wrapper } from 'clients/web3';
import { AuthProvider } from 'context/AuthContext';
import { SuccessfulTransactionModalProvider } from 'context/SuccessfulTransactionModalContext';
import { store } from 'core';
import { Layout, ResetScrollOnRouteChange } from 'components';
import { isOnTestnet } from 'config';
import Dashboard from 'pages/Dashboard';
import Faucet from 'containers/Main/Faucet';
import Vote from 'containers/Main/Vote';
import XVSV1 from 'containers/Main/XVS';
import Xvs from 'pages/Xvs';
import Market from 'pages/Market';
import Vault from 'pages/Vault';
import VaultV1 from 'containers/Main/Vault';
import VoteOverview from 'containers/Main/VoteOverview';
import ProposerDetail from 'containers/Main/ProposerDetail';
import VoterLeaderboard from 'containers/Main/VoterLeaderboard';
import ConvertVrt from 'pages/ConvertVrt';
import MarketDetails from 'pages/MarketDetails';
import TransactionV1 from 'containers/Main/Transaction';
import History from 'pages/History';
import Theme from 'theme';
import { RefreshContextProvider } from 'context/RefreshContext';
import { MarketContextProvider } from 'context/MarketContext';
import { VaiContextProvider } from 'context/VaiContext';
import { MuiThemeProvider } from 'theme/MuiThemeProvider/MuiThemeProvider';
import Path from 'constants/path';
import 'assets/styles/App.scss';

const App = () => (
  <Theme>
    <Web3Wrapper>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <MuiThemeProvider>
            <RefreshContextProvider>
              <AuthProvider>
                <VaiContextProvider>
                  <MarketContextProvider>
                    <SuccessfulTransactionModalProvider>
                      <BrowserRouter>
                        <ToastContainer />
                        <Layout>
                          <ResetScrollOnRouteChange />
                          <Switch>
                            <Route exact path={Path.DASHBOARD} component={Dashboard} />
                            <Route exact path={Path.VOTE} component={Vote} />
                            <Route
                              exact
                              path={Path.XVS}
                              component={process.env.REACT_APP_RUN_V2 ? Xvs : XVSV1}
                            />
                            <Route exact path={Path.MARKET} component={Market} />
                            <Route exact path={Path.MARKET_DETAILS} component={MarketDetails} />
                            <Route
                              exact
                              path={process.env.REACT_APP_RUN_V2 ? Path.HISTORY : Path.TRANSACTION}
                              component={process.env.REACT_APP_RUN_V2 ? History : TransactionV1}
                            />
                            <Route
                              exact
                              path={Path.VAULT}
                              component={process.env.REACT_APP_RUN_V2 ? Vault : VaultV1}
                            />
                            <Route
                              exact
                              path={Path.VOTE_LEADER_BOARD}
                              component={VoterLeaderboard}
                            />
                            <Route exact path={Path.VOTE_PROPOSAL} component={VoteOverview} />
                            <Route exact path={Path.VOTE_ADDRESS} component={ProposerDetail} />
                            <Route exact path={Path.CONVERT_VRT} component={ConvertVrt} />
                            {isOnTestnet && <Route exact path={Path.FAUCET} component={Faucet} />}
                            <Redirect to={Path.DASHBOARD} />
                          </Switch>
                        </Layout>
                      </BrowserRouter>
                    </SuccessfulTransactionModalProvider>
                  </MarketContextProvider>
                </VaiContextProvider>
              </AuthProvider>
            </RefreshContextProvider>
          </MuiThemeProvider>
        </Provider>
      </QueryClientProvider>
    </Web3Wrapper>
  </Theme>
);

export default App;
