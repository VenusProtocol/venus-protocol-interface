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
import { VBEP_TOKENS } from 'constants/tokens';
import Market from 'pages/Market';
import Vault from 'containers/Main/Vault';
import MarketDetailsV1, { Props as IMarketDetailsV1Props } from 'containers/Main/MarketDetail';
import VoteOverview from 'containers/Main/VoteOverview';
import ProposerDetail from 'containers/Main/ProposerDetail';
import VoterLeaderboard from 'containers/Main/VoterLeaderboard';
import ConvertVrt from 'pages/ConvertVrt';
import MarketDetails, { MarketDetailsProps } from 'pages/MarketDetails';
import ConvertVrtV1 from 'containers/Main/VrtConversion';
import Transaction from 'containers/Main/Transaction';
import Theme from 'theme';
import { RefreshContextProvider } from 'context/RefreshContext';
import { MarketContextProvider } from 'context/MarketContext';
import { VaiContextProvider } from 'context/VaiContext';
import { MuiThemeProvider } from 'theme/MuiThemeProvider/MuiThemeProvider';
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
                            <Route exact path="/dashboard" component={Dashboard} />
                            <Route exact path="/vote" component={Vote} />
                            <Route
                              exact
                              path="/xvs"
                              component={process.env.REACT_APP_RUN_V2 ? Xvs : XVSV1}
                            />
                            <Route
                              exact
                              path="/market"
                              component={process.env.REACT_APP_RUN_V2 ? Market : MarketV1}
                            />
                            <Route
                              exact
                              path="/market/:vTokenId"
                              render={props => {
                                // Redirect to market page if vTokenId is
                                // invalid
                                if (
                                  !Object.prototype.hasOwnProperty.call(
                                    VBEP_TOKENS,
                                    props.match.params.vTokenId,
                                  )
                                ) {
                                  return <Redirect to="/market" />;
                                }

                                return process.env.REACT_APP_RUN_V2 ? (
                                  <MarketDetails {...(props as MarketDetailsProps)} />
                                ) : (
                                  <MarketDetailsV1 {...(props as IMarketDetailsV1Props)} />
                                );
                              }}
                            />
                            <Route exact path="/transaction" component={Transaction} />
                            <Route exact path="/vault" component={Vault} />
                            <Route exact path="/vote/leaderboard" component={VoterLeaderboard} />
                            <Route exact path="/vote/proposal/:id" component={VoteOverview} />
                            <Route exact path="/vote/address/:address" component={ProposerDetail} />
                            <Route
                              exact
                              path="/convert-vrt"
                              component={process.env.REACT_APP_RUN_V2 ? ConvertVrt : ConvertVrtV1}
                            />
                            {isOnTestnet && <Route exact path="/faucet" component={Faucet} />}
                            <Redirect from="/" to="/dashboard" />
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
