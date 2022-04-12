import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { queryClient } from 'clients/api';
import { Web3Wrapper } from 'clients/web3';
import { AuthProvider } from 'context/AuthContext';
// import { isOnTestnet } from 'config';
import { store } from 'core';
import { Layout } from 'components';
import { init as initTranslationLibrary } from 'translation';
import Dashboard from 'pages/Dashboard';
// import Faucet from 'pages/Faucet';
// import Vote from 'pages/Vote';
// import XVS from 'pages/XVS';
// import Market from 'pages/Market';
// import Vault from 'pages/Vault';
// import MarketDetail from 'pages/MarketDetail';
// import VoteOverview from 'pages/VoteOverview';
// import ProposerDetail from 'pages/ProposerDetail';
// import VoterLeaderboard from 'pages/VoterLeaderboard';
// import VrtConversion from 'pages/VrtConversion';
// import Transaction from 'pages/Transaction';
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
          <RefreshContextProvider>
            <VaiContextProvider>
              <MarketContextProvider>
                <MuiThemeProvider>
                  <AuthProvider>
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
                          {/* <Route exact path="/vote" component={Vote} />
                          <Route exact path="/xvs" component={XVS} />
                          <Route exact path="/market" component={Market} />
                          <Route exact path="/transaction" component={Transaction} />
                          <Route exact path="/vault" component={Vault} />
                          <Route exact path="/market/:asset" component={MarketDetail} />
                          <Route
                            exact
                            path="/vote/leaderboard"
                            component={VoterLeaderboard}
                          />
                          <Route exact path="/vote/proposal/:id" component={VoteOverview} />
                          <Route
                            exact
                            path="/vote/address/:address"
                            component={ProposerDetail}
                          /> */}
                          {/* <Route exact path="/convert-vrt" component={VrtConversion} /> */}
                          {/* {isOnTestnet && <Route exact path="/faucet" component={Faucet} />} */}
                          <Redirect from="/" to="/dashboard" />
                        </Switch>
                      </Layout>
                    </BrowserRouter>
                  </AuthProvider>
                </MuiThemeProvider>
              </MarketContextProvider>
            </VaiContextProvider>
          </RefreshContextProvider>
        </Provider>
      </QueryClientProvider>
    </Web3Wrapper>
  </Theme>
);

export default App;
