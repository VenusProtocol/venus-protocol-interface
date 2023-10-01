import { SuspenseWithSpinner } from 'components';
import React, { lazy, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { isFeatureEnabled } from 'utilities';

import 'assets/styles/App.scss';
import { routes } from 'constants/routing';
import { useAuth } from 'context/AuthContext';

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
          <SuspenseWithSpinner>
            <Dashboard />
          </SuspenseWithSpinner>
        }
      />

      {!!accountAddress && (
        <Route
          path={routes.account.path}
          element={
            <SuspenseWithSpinner>
              <Account />
            </SuspenseWithSpinner>
          }
        />
      )}

      {isFeatureEnabled('isolatedPools') && (
        <Route
          path={routes.isolatedPools.path}
          element={
            <SuspenseWithSpinner>
              <IsolatedPools />
            </SuspenseWithSpinner>
          }
        />
      )}

      {isFeatureEnabled('isolatedPools') && (
        <Route
          path={routes.isolatedPool.path}
          element={
            <SuspenseWithSpinner>
              <IsolatedPool />
            </SuspenseWithSpinner>
          }
        />
      )}

      {isFeatureEnabled('isolatedPools') && (
        <Route
          path={routes.isolatedPoolMarket.path}
          element={
            <SuspenseWithSpinner>
              <IsolatedPoolMarket />
            </SuspenseWithSpinner>
          }
        />
      )}

      <Route
        path={routes.corePool.path}
        element={
          <SuspenseWithSpinner>
            <CorePool />
          </SuspenseWithSpinner>
        }
      />
      <Route
        path={routes.corePoolMarket.path}
        element={
          <SuspenseWithSpinner>
            <CorePoolMarket />
          </SuspenseWithSpinner>
        }
      />

      <Route
        path={routes.vaults.path}
        element={
          <SuspenseWithSpinner>
            <Vaults />
          </SuspenseWithSpinner>
        }
      />

      <Route
        path={routes.history.path}
        element={
          <SuspenseWithSpinner>
            <History />
          </SuspenseWithSpinner>
        }
      />

      {/* suffix with a /* to make it accept nested routes */}
      <Route
        path={`${routes.governance.path}/*`}
        element={
          <SuspenseWithSpinner>
            <Governance />
          </SuspenseWithSpinner>
        }
      />

      <Route
        path={routes.governanceLeaderBoard.path}
        element={
          <SuspenseWithSpinner>
            <VoterLeaderboard />
          </SuspenseWithSpinner>
        }
      />
      <Route
        path={routes.governanceVoter.path}
        element={
          <SuspenseWithSpinner>
            <Voter />
          </SuspenseWithSpinner>
        }
      />
      <Route
        path={routes.governanceProposal.path}
        element={
          <SuspenseWithSpinner>
            <Proposal />
          </SuspenseWithSpinner>
        }
      />

      <Route
        path={routes.xvs.path}
        element={
          <SuspenseWithSpinner>
            <Xvs />
          </SuspenseWithSpinner>
        }
      />

      <Route
        path={routes.convertVrt.path}
        element={
          <SuspenseWithSpinner>
            <ConvertVrt />
          </SuspenseWithSpinner>
        }
      />

      <Route
        path={routes.swap.path}
        element={
          <SuspenseWithSpinner>
            <Swap />
          </SuspenseWithSpinner>
        }
      />

      <Route
        path={routes.vai.path}
        element={
          <SuspenseWithSpinner>
            <Vai />
          </SuspenseWithSpinner>
        }
      />

      {/* redirect to the dashboard if no route matches */}
      <Route path="*" element={<Navigate to={routes.dashboard.path} />} />
    </Routes>
  );
};

export default Router;
