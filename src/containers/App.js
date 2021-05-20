import { hot } from 'react-hot-loader/root';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { IntlProvider, addLocaleData } from 'react-intl';
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import en from 'react-intl/locale-data/en';
import enMessages from 'lang/en';
import { store } from 'core';
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
import Theme from './Theme';

import 'assets/styles/App.scss';

addLocaleData([...en]);
const initialLang = 'en';

const messages = {
  en: enMessages
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: initialLang
    };
  }

  render() {
    const { lang } = this.state;
    const message = messages[lang];
    return (
      <Theme>
        <IntlProvider locale={lang} messages={message}>
          <Provider store={store}>
            <BrowserRouter>
              <ToastContainer
                autoClose={8000}
                transition={Slide}
                hideProgressBar
                newestOnTop
                position={toast.POSITION.TOP_LEFT}
              />
              <Switch
                atEnter={{ opacity: 0 }}
                atLeave={{ opacity: 0.5 }}
                atActive={{ opacity: 1 }}
                className="switch-wrapper"
              >
                <Route exact path="/dashboard" component={Dashboard} />
                <Route exact path="/vote" component={Vote} />
                <Route exact path="/xvs" component={XVS} />
                <Route exact path="/market" component={Market} />
                <Route exact path="/vault" component={Vault} />
                <Route exact path="/market/:asset" component={MarketDetail} />
                <Route
                  exact
                  path="/vote/leaderboard"
                  component={VoterLeaderboard}
                />
                <Route
                  exact
                  path="/vote/proposal/:id"
                  component={VoteOverview}
                />
                <Route
                  exact
                  path="/vote/address/:address"
                  component={ProposerDetail}
                />
                {process.env.REACT_APP_ENV === 'dev' && (
                  <Route exact path="/faucet" component={Faucet} />
                )}
                <Redirect from="/" to="/dashboard" />
              </Switch>
            </BrowserRouter>
          </Provider>
        </IntlProvider>
      </Theme>
    );
  }
}

export default hot(App);
