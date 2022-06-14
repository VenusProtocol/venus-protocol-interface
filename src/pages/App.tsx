import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import { queryClient } from 'clients/api';
import { Web3Wrapper } from 'clients/web3';
import { AuthProvider } from 'context/AuthContext';
import { SuccessfulTransactionModalProvider } from 'context/SuccessfulTransactionModalContext';
import { Layout, ResetScrollOnRouteChange } from 'components';
import Dashboard from 'pages/Dashboard';
import Vote from 'pages/Vote';
import Xvs from 'pages/Xvs';
import Market from 'pages/Market';
import Vault from 'pages/Vault';
import Proposal from 'pages/Proposal';
import VoterDetails from 'pages/VoterDetails';
import VoterLeaderboard from 'pages/VoterLeaderboard';
import ConvertVrt from 'pages/ConvertVrt';
import MarketDetails from 'pages/MarketDetails';
import History from 'pages/History';
import { RefreshContextProvider } from 'context/RefreshContext';
import { VaiContextProvider } from 'context/VaiContext';
import { MuiThemeProvider } from 'theme/MuiThemeProvider';
import Path from 'constants/path';
import 'assets/styles/App.scss';

const App = () => (
  <Web3Wrapper>
    <QueryClientProvider client={queryClient}>
      <MuiThemeProvider>
        <RefreshContextProvider>
          <AuthProvider>
            <VaiContextProvider>
              <SuccessfulTransactionModalProvider>
                <BrowserRouter>
                  <ToastContainer />
                  <Layout>
                    <ResetScrollOnRouteChange />
                    <Switch>
                      <Route exact path={Path.DASHBOARD} component={Dashboard} />

                      <Route exact path={Path.MARKET} component={Market} />
                      <Route exact path={Path.MARKET_DETAILS} component={MarketDetails} />

                      <Route exact path={Path.VAULT} component={Vault} />

                            <Route exact path={Path.HISTORY} component={History} />

                            <Route
                              exact
                              path={Path.VOTE}
                              component={process.env.REACT_APP_RUN_V2 ? Vote : VoteV1}
                            />
                            <Route
                              exact
                              path={Path.VOTE_LEADER_BOARD}
                              component={VoterLeaderboard}
                            />
                            <Route exact path={Path.VOTE_ADDRESS} component={ProposerDetail} />
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
            </VaiContextProvider>
          </AuthProvider>
        </RefreshContextProvider>
      </MuiThemeProvider>
    </QueryClientProvider>
  </Web3Wrapper>
);

export default App;
