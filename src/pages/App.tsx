import { Layout, ResetScrollOnRouteChange } from 'components';
import React from 'react';
import { QueryClientProvider } from 'react-query';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import 'assets/styles/App.scss';
import { queryClient } from 'clients/api';
import { Web3Wrapper } from 'clients/web3';
import Path from 'constants/path';
import { AuthProvider } from 'context/AuthContext';
import { DisableLunaUstWarningProvider } from 'context/DisableLunaUstWarning';
import { SuccessfulTransactionModalProvider } from 'context/SuccessfulTransactionModalContext';
import Account from 'pages/Account';
import ConvertVrt from 'pages/ConvertVrt';
import Dashboard from 'pages/Dashboard';
import History from 'pages/History';
import Markets from 'pages/Market';
import MarketDetails from 'pages/MarketDetails';
import Proposal from 'pages/Proposal';
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
            <DisableLunaUstWarningProvider>
              <BrowserRouter>
                <ToastContainer />

                <Layout>
                  <ResetScrollOnRouteChange />

                  <Switch>
                    <Route exact path={Path.ROOT} component={Dashboard} />

                    <Route exact path={Path.ACCOUNT} component={Account} />

                    <Route exact path={Path.MARKETS} component={Markets} />
                    <Route exact path={Path.MARKET_DETAILS} component={MarketDetails} />

                    <Route exact path={Path.VAULTS} component={Vaults} />

                    <Route exact path={Path.HISTORY} component={History} />

                    <Route exact path={Path.GOVERNANCE} component={Vote} />
                    <Route exact path={Path.GOVERNANCE_LEADER_BOARD} component={VoterLeaderboard} />
                    <Route exact path={Path.GOVERNANCE_ADDRESS} component={VoterDetails} />
                    <Route exact path={Path.GOVERNANCE_PROPOSAL_DETAILS} component={Proposal} />

                    <Route exact path={Path.XVS} component={Xvs} />

                    <Route exact path={Path.CONVERT_VRT} component={ConvertVrt} />

                    <Redirect to={Path.ROOT} />
                  </Switch>
                </Layout>
              </BrowserRouter>
            </DisableLunaUstWarningProvider>
          </SuccessfulTransactionModalProvider>
        </AuthProvider>
      </MuiThemeProvider>
    </QueryClientProvider>
  </Web3Wrapper>
);

export default App;
