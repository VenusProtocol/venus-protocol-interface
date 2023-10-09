import React, { lazy, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { routes } from 'constants/routing';
import { useAuth } from 'context/AuthContext';

import PageSuspense from './PageSuspense';

const Dashboard = lazy(() => import('pages/Dashboard'));
const Account = lazy(() => import('pages/Account'));
const CorePoolMarket = lazy(() => import('pages/Market/CorePoolMarket'));
const IsolatedPoolMarket = lazy(() => import('pages/Market/IsolatedPoolMarket'));
const CorePool = lazy(() => import('pages/Pool/CorePool'));
const IsolatedPool = lazy(() => import('pages/Pool/IsolatedPool'));
const ConvertVrt = lazy(() => import('pages/ConvertVrt'));
const Governance = lazy(() => import('pages/Governance'));
const History = lazy(() => import('pages/History'));
const IsolatedPools = lazy(() => import('pages/IsolatedPools'));
const Proposal = lazy(() => import('pages/Proposal'));
const Swap = lazy(() => import('pages/Swap'));
const Vai = lazy(() => import('pages/Vai'));
const Vaults = lazy(() => import('pages/Vault'));
const Voter = lazy(() => import('pages/Voter'));
const VoterLeaderboard = lazy(() => import('pages/VoterLeaderboard'));
const Xvs = lazy(() => import('pages/Xvs'));

const Router = () => {
  const { accountAddress } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll to the top of the page on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

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
      <Route
        path={routes.dashboard.path}
        element={
          <PageSuspense>
            <Dashboard />
          </PageSuspense>
        }
      />

      {!!accountAddress && (
        <Route
          path={routes.account.path}
          element={
            <PageSuspense>
              <Account />
            </PageSuspense>
          }
        />
      )}

      <Route
        path={routes.isolatedPools.path}
        element={
          <PageSuspense>
            <IsolatedPools />
          </PageSuspense>
        }
      />

      <Route
        path={routes.isolatedPool.path}
        element={
          <PageSuspense>
            <IsolatedPool />
          </PageSuspense>
        }
      />

      <Route
        path={routes.isolatedPoolMarket.path}
        element={
          <PageSuspense>
            <IsolatedPoolMarket />
          </PageSuspense>
        }
      />

      <Route
        path={routes.corePool.path}
        element={
          <PageSuspense>
            <CorePool />
          </PageSuspense>
        }
      />
      <Route
        path={routes.corePoolMarket.path}
        element={
          <PageSuspense>
            <CorePoolMarket />
          </PageSuspense>
        }
      />

      <Route
        path={routes.vaults.path}
        element={
          <PageSuspense>
            <Vaults />
          </PageSuspense>
        }
      />

      <Route
        path={routes.history.path}
        element={
          <PageSuspense>
            <History />
          </PageSuspense>
        }
      />

      {/* suffix with a /* to make it accept nested routes */}
      <Route
        path={`${routes.governance.path}/*`}
        element={
          <PageSuspense>
            <Governance />
          </PageSuspense>
        }
      />

      <Route
        path={routes.governanceLeaderBoard.path}
        element={
          <PageSuspense>
            <VoterLeaderboard />
          </PageSuspense>
        }
      />
      <Route
        path={routes.governanceVoter.path}
        element={
          <PageSuspense>
            <Voter />
          </PageSuspense>
        }
      />
      <Route
        path={routes.governanceProposal.path}
        element={
          <PageSuspense>
            <Proposal />
          </PageSuspense>
        }
      />

      <Route
        path={routes.xvs.path}
        element={
          <PageSuspense>
            <Xvs />
          </PageSuspense>
        }
      />

      <Route
        path={routes.convertVrt.path}
        element={
          <PageSuspense>
            <ConvertVrt />
          </PageSuspense>
        }
      />

      <Route
        path={routes.swap.path}
        element={
          <PageSuspense>
            <Swap />
          </PageSuspense>
        }
      />

      <Route
        path={routes.vai.path}
        element={
          <PageSuspense>
            <Vai />
          </PageSuspense>
        }
      />

      {/* redirect to the dashboard if no route matches */}
      <Route path="*" element={<Navigate to={routes.dashboard.path} />} />
    </Routes>
  );
};

export default Router;
