import { Layout, ResetScrollOnRouteChange } from 'components';
import React from 'react';
import { QueryClientProvider } from 'react-query';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import 'assets/styles/App.scss';
import { queryClient } from 'clients/api';
import { Web3Wrapper } from 'clients/web3';
import { routes } from 'constants/routing';
import { AuthProvider } from 'context/AuthContext';
import { DisableLunaUstWarningProvider } from 'context/DisableLunaUstWarning';
import { IncludeXvsProvider } from 'context/IncludeXvsContext';
import { SuccessfulTransactionModalProvider } from 'context/SuccessfulTransactionModalContext';
import Account from 'pages/Account';
import ConvertVrt from 'pages/ConvertVrt';
import Dashboard from 'pages/Dashboard';
import History from 'pages/History';
import Market from 'pages/Market';
import Pool from 'pages/Pool';
import Pools from 'pages/Pools';
import Proposal from 'pages/Proposal';
import Vai from 'pages/Vai';
import Vaults from 'pages/Vault';
import Vote from 'pages/Vote';
import VoterDetails from 'pages/VoterDetails';
import VoterLeaderboard from 'pages/VoterLeaderboard';
import Xvs from 'pages/Xvs';
import { MuiThemeProvider } from 'theme/MuiThemeProvider';

const App = () => (
  <Web3Wrapper>
    <QueryClientProvider client={queryClient}>
      <MuiThemeProvider>
        <AuthProvider>
          <SuccessfulTransactionModalProvider>
            <IncludeXvsProvider>
              <DisableLunaUstWarningProvider>
                <BrowserRouter>
                  <ToastContainer />

                  <Layout>
                    <ResetScrollOnRouteChange />

                    <Switch>
                      <Route exact path={routes.dashboard.path} component={Dashboard} />

                      <Route exact path={routes.account.path} component={Account} />

                      <Route exact path={routes.pools.path} component={Pools} />
                      <Route exact path={routes.pool.path} component={Pool} />
                      <Route exact path={routes.market.path} component={Market} />

                      <Route exact path={routes.vaults.path} component={Vaults} />

                      <Route exact path={routes.history.path} component={History} />

                      <Route exact path={routes.governance.path} component={Vote} />
                      <Route
                        exact
                        path={routes.governanceLeaderBoard.path}
                        component={VoterLeaderboard}
                      />
                      <Route exact path={routes.governanceVoter.path} component={VoterDetails} />
                      <Route exact path={routes.governanceProposal.path} component={Proposal} />

                      <Route exact path={routes.xvs.path} component={Xvs} />

                      <Route exact path={routes.convertVrt.path} component={ConvertVrt} />

                      <Route exact path={routes.vai.path} component={Vai} />

                      <Redirect to={routes.dashboard.path} />
                    </Switch>
                  </Layout>
                </BrowserRouter>
              </DisableLunaUstWarningProvider>
            </IncludeXvsProvider>
          </SuccessfulTransactionModalProvider>
        </AuthProvider>
      </MuiThemeProvider>
    </QueryClientProvider>
  </Web3Wrapper>
);

export default App;
