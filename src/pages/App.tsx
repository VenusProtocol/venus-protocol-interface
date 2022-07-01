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
import Dashboard from 'pages/Dashboard';
import VoteV1 from 'containers/Main/Vote';
import Vote from 'pages/Vote';
import Xvs from 'pages/Xvs';
import Market from 'pages/Market';
import Vault from 'pages/Vault';
import VaultV1 from 'containers/Main/Vault';
import VoteOverview from 'containers/Main/VoteOverview';
import VoterDetails from 'pages/VoterDetails';
import Proposal from 'pages/Proposal';
import ProposerDetail from 'containers/Main/ProposerDetail';
import VoterLeaderboardV1 from 'containers/Main/VoterLeaderboard';
import VoterLeaderboard from 'pages/VoterLeaderboard';
import ConvertVrt from 'pages/ConvertVrt';
import MarketDetails from 'pages/MarketDetails';
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

                            <Route exact path={Path.MARKET} component={Market} />
                            <Route exact path={Path.MARKET_DETAILS} component={MarketDetails} />

                            <Route
                              exact
                              path={Path.VAULT}
                              component={process.env.REACT_APP_RUN_V2 ? Vault : VaultV1}
                            />

                            <Route exact path={Path.HISTORY} component={History} />

                            <Route
                              exact
                              path={Path.VOTE}
                              component={process.env.REACT_APP_RUN_V2 ? Vote : VoteV1}
                            />
                            <Route
                              exact
                              path={Path.VOTE_LEADER_BOARD}
                              component={
                                process.env.REACT_APP_RUN_V2 ? VoterLeaderboard : VoterLeaderboardV1
                              }
                            />
                            <Route
                              exact
                              path={Path.VOTE_ADDRESS}
                              component={
                                process.env.REACT_APP_RUN_V2 ? VoterDetails : ProposerDetail
                              }
                            />
                            <Route
                              exact
                              path={Path.VOTE_PROPOSAL_DETAILS}
                              component={process.env.REACT_APP_RUN_V2 ? Proposal : VoteOverview}
                            />

                            <Route exact path={Path.XVS} component={Xvs} />

                            <Route exact path={Path.CONVERT_VRT} component={ConvertVrt} />

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
