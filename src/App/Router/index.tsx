import React, { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { isFeatureEnabled } from 'utilities';

import 'assets/styles/App.scss';
import { routes } from 'constants/routing';
import { useAuth } from 'context/AuthContext';
import Account from 'pages/Account';
import ConvertVrt from 'pages/ConvertVrt';
import Dashboard from 'pages/Dashboard';
import Vote from 'pages/Governance';
import History from 'pages/History';
import IsolatedPools from 'pages/IsolatedPools';
import { CorePoolMarket, IsolatedPoolMarket } from 'pages/Market';
import { CorePool, IsolatedPool } from 'pages/Pool';
import Proposal from 'pages/Proposal';
import Swap from 'pages/Swap';
import Vai from 'pages/Vai';
import Vaults from 'pages/Vault';
import Voter from 'pages/Voter';
import VoterLeaderboard from 'pages/VoterLeaderboard';
import Xvs from 'pages/Xvs';

const Router = () => {
  const { accountAddress } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect to account page if user has already connected their wallet and is
  // visiting the dashboard. If they refresh the page while being on the
  // dashboard, the redirection will not happen
  useEffect(() => {
    if (
      !!accountAddress &&
      location.pathname === routes.dashboard.path &&
      window.history.length <= 2
    ) {
      navigate(routes.account.path);
    }
  }, [location, accountAddress]);

  return (
    <Routes>
      <Route path={routes.dashboard.path} element={<Dashboard />} />

      {!!accountAddress && <Route path={routes.account.path} element={<Account />} />}

      {isFeatureEnabled('isolatedPools') && (
        <Route path={routes.isolatedPools.path} element={<IsolatedPools />} />
      )}

      {isFeatureEnabled('isolatedPools') && (
        <Route path={routes.isolatedPool.path} element={<IsolatedPool />} />
      )}

      {isFeatureEnabled('isolatedPools') && (
        <Route path={routes.isolatedPoolMarket.path} element={<IsolatedPoolMarket />} />
      )}

      <Route path={routes.corePool.path} element={<CorePool />} />
      <Route path={routes.corePoolMarket.path} element={<CorePoolMarket />} />

      <Route path={routes.vaults.path} element={<Vaults />} />

      <Route path={routes.history.path} element={<History />} />

      {/* suffix with a /* to make it accept nested routes */}
      <Route path={`${routes.governance.path}/*`} element={<Vote />} />

      <Route path={routes.governanceLeaderBoard.path} element={<VoterLeaderboard />} />
      <Route path={routes.governanceVoter.path} element={<Voter />} />
      <Route path={routes.governanceProposal.path} element={<Proposal />} />

      <Route path={routes.xvs.path} element={<Xvs />} />

      <Route path={routes.convertVrt.path} element={<ConvertVrt />} />

      <Route path={routes.swap.path} element={<Swap />} />

      <Route path={routes.vai.path} element={<Vai />} />

      {/* redirect to the dashboard if no route matches */}
      <Route path="*" element={<Dashboard />} />
    </Routes>
  );
};

export default Router;
