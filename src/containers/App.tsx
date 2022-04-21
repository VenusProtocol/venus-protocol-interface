import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { IntlProvider, addLocaleData } from 'react-intl';
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import en from 'react-intl/locale-data/en';

import { queryClient } from 'clients/api';
import { Web3Wrapper } from 'clients/web3';
import { AuthProvider } from 'context/AuthContext';
import { isOnTestnet } from 'config';
import enMessages from 'lang/en.json';
import { store } from 'core';
import { Layout } from 'components';
import Dashboard from 'containers/Main/Dashboard';
import Faucet from 'containers/Main/Faucet';
import Vote from 'containers/Main/Vote';
import XVS from 'containers/Main/XVS';
import Market from 'containers/Main/Market';
import Vault from 'containers/Main/Vault';
import MarketDetail from 'containers/Main/MarketDetail';
import VoteOverview from 'containers/Main/VoteOverview';
import ProposerDetail from 'containers/Main/ProposerDetail';
import VoterLeaderboard from 'containers/Main/VoterLeaderboard';
import VrtConversion from 'containers/Main/VrtConversion';
import Transaction from 'containers/Main/Transaction';
import Theme from 'theme';
import { RefreshContextProvider } from '../context/RefreshContext';
import { MarketContextProvider } from '../context/MarketContext';
import { VaiContextProvider } from '../context/VaiContext';
import { MuiThemeProvider } from '../theme/MuiThemeProvider/MuiThemeProvider';
import 'assets/styles/App.scss';

addLocaleData([...en]);
const initialLang = 'en';

const messages = {
  en: enMessages,
};

class App extends React.Component<Record<string, unknown>, { lang: 'en' }> {
  constructor(props: Record<string, unknown>) {
    super(props);
    this.state = {
      lang: initialLang,
    };
  }

  render() {
    const { lang } = this.state;
    const message = messages[lang];
    return (
      <Theme>
        <IntlProvider locale={lang} messages={message}>
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
                                <Route exact path="/vote" component={Vote} />
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
                                />
                                <Route exact path="/convert-vrt" component={VrtConversion} />
                                {isOnTestnet && <Route exact path="/faucet" component={Faucet} />}
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
        </IntlProvider>
      </Theme>
    );
  }
}

export default App;
