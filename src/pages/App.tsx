import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { queryClient } from 'clients/api';
import { Web3Wrapper } from 'clients/web3';
import { AuthProvider } from 'context/AuthContext';
import { SuccessfulTransactionModalProvider } from 'context/SuccessfulTransactionModalContext';
import { store } from 'core';
import { Layout } from 'components';
import { init as initTranslationLibrary } from 'translation';
import { isOnTestnet } from 'config';
import Dashboard from 'pages/Dashboard';
import Faucet from 'containers/Main/Faucet';
import Vote from 'containers/Main/Vote';
import XVSV1 from 'containers/Main/XVS';
import Xvs from 'pages/Xvs';
import MarketV1 from 'containers/Main/Market';
import Market from 'pages/Market';
import Vault from 'containers/Main/Vault';
import MarketDetailsV1 from 'containers/Main/MarketDetail';
import VoteOverview from 'containers/Main/VoteOverview';
import ProposerDetail from 'containers/Main/ProposerDetail';
import VoterLeaderboard from 'containers/Main/VoterLeaderboard';
import ConvertVrt from 'pages/ConvertVrt';
import MarketDetails from 'pages/MarketDetails';
import ConvertVrtV1 from 'containers/Main/VrtConversion';
import Transaction from 'containers/Main/Transaction';
import Theme from 'theme';
import { RefreshContextProvider } from 'context/RefreshContext';
import { MarketContextProvider } from 'context/MarketContext';
import { VaiContextProvider } from 'context/VaiContext';
import { MuiThemeProvider } from 'theme/MuiThemeProvider/MuiThemeProvider';
import Path from 'constants/path';
import 'assets/styles/App.scss';

initTranslationLibrary();

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
                        <ToastContainer
                          autoClose={8000}
                          transition={Slide}
                          hideProgressBar
                          newestOnTop
                          position={toast.POSITION.TOP_LEFT}
                        />
                        <Layout>
                          <Switch>
                            <Route exact path={Path.DASHBOARD} component={Dashboard} />
                            <Route exact path={Path.VOTE} component={Vote} />
                            <Route
                              exact
                              path={Path.XVS}
                              component={process.env.REACT_APP_RUN_V2 ? Xvs : XVSV1}
                            />
                            <Route
                              exact
                              path={Path.MARKET}
                              component={process.env.REACT_APP_RUN_V2 ? Market : MarketV1}
                            />
                            <Route
                              exact
                              path="/market/:vTokenId"
                              component={
                                process.env.REACT_APP_RUN_V2 ? MarketDetails : MarketDetailsV1
                              }
                            />
                            <Route exact path={Path.TRANSACTION} component={Transaction} />
                            <Route exact path={Path.VAULT} component={Vault} />
                            <Route
                              exact
                              path={Path.VOTE_LEADER_BOARD}
                              component={VoterLeaderboard}
                            />
                            <Route exact path={Path.VOTE_PROPOSAL} component={VoteOverview} />
                            <Route exact path={Path.VOTE_ADDRESS} component={ProposerDetail} />
                            <Route
                              exact
                              path={Path.CONVERT_VRT}
                              component={process.env.REACT_APP_RUN_V2 ? ConvertVrt : ConvertVrtV1}
                            />
                            {isOnTestnet && <Route exact path={Path.FAUCET} component={Faucet} />}
                            <Redirect from={Path.ROOT} to={Path.DASHBOARD} />
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
