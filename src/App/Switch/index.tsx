import React, { useEffect } from 'react';
import { Switch as RRSwitch, Redirect, Route, useHistory, useLocation } from 'react-router-dom';
import { isFeatureEnabled } from 'utilities';

import 'assets/styles/App.scss';
import { routes } from 'constants/routing';
import { useAuth } from 'context/AuthContext';
import Account from 'pages/Account';
import ConvertVrt from 'pages/ConvertVrt';
import Dashboard from 'pages/Dashboard';
import Vote from 'pages/Governance';
import History from 'pages/History';
import Market from 'pages/Market';
import Pool from 'pages/Pool';
import Pools from 'pages/Pools';
import Proposal from 'pages/Proposal';
import Swap from 'pages/Swap';
import Vai from 'pages/Vai';
import Vaults from 'pages/Vault';
import Voter from 'pages/Voter';
import VoterLeaderboard from 'pages/VoterLeaderboard';
import Xvs from 'pages/Xvs';

const Switch = () => {
  const { accountAddress } = useAuth();
  const location = useLocation();
  const history = useHistory();

  // Redirect to account page if user has already connected their wallet and is
  // visiting the dashboard. If they refresh the page while being on the
  // dashboard, the redirection will not happen
  useEffect(() => {
    if (!!accountAddress && location.pathname === routes.dashboard.path && history.length <= 2) {
      history.replace(routes.account.path);
    }
  }, [location, accountAddress, history]);

  return (
    <RRSwitch>
      <Route exact path={routes.dashboard.path} component={Dashboard} />

      {!!accountAddress && <Route exact path={routes.account.path} component={Account} />}

      {isFeatureEnabled('isolatedPools') && (
        <Route exact path={routes.pools.path} component={Pools} />
      )}

      {isFeatureEnabled('isolatedPools') && (
        <Route exact path={routes.pool.path} component={Pool} />
      )}

      {!isFeatureEnabled('isolatedPools') && (
        <Route exact path={routes.markets.path} component={Pool} />
      )}

      <Route exact path={routes.market.path} component={Market} />

      <Route exact path={routes.vaults.path} component={Vaults} />

      <Route exact path={routes.history.path} component={History} />

      <Route exact path={routes.governance.path} component={Vote} />
      <Route exact path={routes.governanceLeaderBoard.path} component={VoterLeaderboard} />
      <Route exact path={routes.governanceVoter.path} component={Voter} />
      <Route exact path={routes.governanceProposal.path} component={Proposal} />

      <Route exact path={routes.xvs.path} component={Xvs} />

      <Route exact path={routes.convertVrt.path} component={ConvertVrt} />

      <Route exact path={routes.swap.path} component={Swap} />

      <Route exact path={routes.vai.path} component={Vai} />

      <Redirect to={routes.dashboard.path} />
    </RRSwitch>
  );
};

export default Switch;
