import { Layout, ResetScrollOnRouteChange } from 'components';
import React from 'react';
import { QueryClientProvider } from 'react-query';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import 'assets/styles/App.scss';
import { queryClient } from 'clients/api';
import { Web3Wrapper } from 'clients/web3';
import { paths } from 'constants/routing';
import { AuthProvider } from 'context/AuthContext';
import { BreadcrumbNavigationProvider } from 'context/BreadcrumbNavigationContext';
import { DisableLunaUstWarningProvider } from 'context/DisableLunaUstWarning';
import { IncludeXvsProvider } from 'context/IncludeXvsContext';
import { SuccessfulTransactionModalProvider } from 'context/SuccessfulTransactionModalContext';
import Account from 'pages/Account';
import Asset from 'pages/Asset';
import ConvertVrt from 'pages/ConvertVrt';
import Dashboard from 'pages/Dashboard';
import History from 'pages/History';
import Market from 'pages/Market';
import Markets from 'pages/Markets';
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
                  <BreadcrumbNavigationProvider>
                    <ToastContainer />

                    <Layout>
                      <ResetScrollOnRouteChange />

                      <Switch>
                        <Route exact path={paths.dashboard} component={Dashboard} />

                        <Route exact path={paths.account} component={Account} />

                        <Route exact path={paths.markets} component={Markets} />
                        <Route exact path={paths.market} component={Market} />
                        <Route exact path={paths.marketAsset} component={Asset} />

                        <Route exact path={paths.vaults} component={Vaults} />

                        <Route exact path={paths.history} component={History} />

                        <Route exact path={paths.governance} component={Vote} />
                        <Route
                          exact
                          path={paths.governanceLeaderBoard}
                          component={VoterLeaderboard}
                        />
                        <Route exact path={paths.governanceVoter} component={VoterDetails} />
                        <Route exact path={paths.governanceProposal} component={Proposal} />

                        <Route exact path={paths.xvs} component={Xvs} />

                        <Route exact path={paths.convertVrt} component={ConvertVrt} />

                        <Route exact path={paths.vai} component={Vai} />

                        <Redirect to={paths.dashboard} />
                      </Switch>
                    </Layout>
                  </BreadcrumbNavigationProvider>
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
