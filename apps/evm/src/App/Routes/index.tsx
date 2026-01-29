import { useEffect, useLayoutEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router';

import { PAGE_CONTAINER_ID } from 'constants/layout';
import { Subdirectory, routes } from 'constants/routing';
import { Layout } from 'containers/Layout';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';

import { DISCORD_SERVER_URL } from 'constants/production';
import { Redirect } from 'containers/Redirect';
import { safeLazyLoad } from 'utilities';
import { MarketRedirect } from './MarketRedirect';
import PageSuspense from './PageSuspense';

const Landing = safeLazyLoad(() => import('pages/Landing'));
const IsolatedPools = safeLazyLoad(() => import('pages/IsolatedPools'));
const Markets = safeLazyLoad(() => import('pages/Markets'));
const Market = safeLazyLoad(() => import('pages/Market'));
const Dashboard = safeLazyLoad(() => import('pages/Dashboard'));
const Port = safeLazyLoad(() => import('pages/Port'));
const Governance = safeLazyLoad(() => import('pages/Governance'));
const Proposal = safeLazyLoad(() => import('pages/Proposal'));
const Swap = safeLazyLoad(() => import('pages/Swap'));
const Vai = safeLazyLoad(() => import('pages/Vai'));
const Staking = safeLazyLoad(() => import('pages/Staking'));
const Voter = safeLazyLoad(() => import('pages/Voter'));
const VoterLeaderboard = safeLazyLoad(() => import('pages/VoterLeaderboard'));
const PrimeCalculator = safeLazyLoad(() => import('pages/PrimeCalculator'));
const Bridge = safeLazyLoad(() => import('pages/Bridge'));
const PrivacyPolicy = safeLazyLoad(() => import('pages/PrivacyPolicy'));
const TermsOfUse = safeLazyLoad(() => import('pages/TermsOfUse'));

const AppRoutes = () => {
  const location = useLocation();
  const swapRouteEnabled = useIsFeatureEnabled({ name: 'swapRoute' });
  const vaiRouteEnabled = useIsFeatureEnabled({ name: 'vaiRoute' });
  const bridgeEnabled = useIsFeatureEnabled({ name: 'bridgeRoute' });
  const primeCalculatorEnabled = useIsFeatureEnabled({
    name: 'primeCalculator',
  });

  // Scroll to the top of the page on route change
  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useLayoutEffect(() => {
    document.getElementById(PAGE_CONTAINER_ID)?.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [location.pathname]);

  useEffect(() => {
    if (window.location.pathname.startsWith('/discord')) {
      window.location.replace(DISCORD_SERVER_URL);
    }
  }, []);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          index
          element={
            <PageSuspense>
              <Landing />
            </PageSuspense>
          }
        />

        <Route
          path={Subdirectory.DASHBOARD}
          element={
            <PageSuspense>
              <Dashboard />
            </PageSuspense>
          }
        />

        <Route
          path={Subdirectory.PORT}
          element={
            <PageSuspense>
              <Port />
            </PageSuspense>
          }
        />

        <Route path={Subdirectory.ISOLATED_POOLS}>
          <Route
            index
            element={
              <PageSuspense>
                <IsolatedPools />
              </PageSuspense>
            }
          />
        </Route>

        <Route path={Subdirectory.MARKETS}>
          <Route
            index
            element={
              <PageSuspense>
                <Markets />
              </PageSuspense>
            }
          />

          <Route
            path={Subdirectory.MARKET}
            element={
              <PageSuspense>
                <Market />
              </PageSuspense>
            }
          />
        </Route>

        {primeCalculatorEnabled && (
          <Route
            path={Subdirectory.PRIME_CALCULATOR}
            element={
              <PageSuspense>
                <PrimeCalculator />
              </PageSuspense>
            }
          />
        )}

        <Route path={Subdirectory.STAKING}>
          <Route
            index
            element={
              <PageSuspense>
                <Staking />
              </PageSuspense>
            }
          />
        </Route>

        {/* TODO: refactor to use nested routes (see VEN-2235) */}
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

        {swapRouteEnabled && (
          <Route
            path={Subdirectory.SWAP}
            element={
              <PageSuspense>
                <Swap />
              </PageSuspense>
            }
          />
        )}

        {vaiRouteEnabled && (
          <Route
            path={Subdirectory.VAI}
            element={
              <PageSuspense>
                <Vai />
              </PageSuspense>
            }
          />
        )}

        {bridgeEnabled && (
          <Route
            path={Subdirectory.BRIDGE}
            element={
              <PageSuspense>
                <Bridge />
              </PageSuspense>
            }
          />
        )}

        <Route
          path={Subdirectory.PRIVACY_POLICY}
          element={
            <PageSuspense>
              <PrivacyPolicy />
            </PageSuspense>
          }
        />

        <Route
          path={Subdirectory.TERMS_OF_USE}
          element={
            <PageSuspense>
              <TermsOfUse />
            </PageSuspense>
          }
        />

        {/* Redirect old pages to new ones */}
        <Route path="/account/*" element={<Redirect to={routes.dashboard.path} />} />
        <Route path="/vaults/*" element={<Redirect to={routes.staking.path} />} />
        <Route
          path="/pool/:poolComptrollerAddress/market/:vTokenAddress"
          element={<MarketRedirect />}
        />
        <Route
          path="/pool/:poolComptrollerAddress"
          element={<Redirect to={routes.markets.path} />}
        />

        {/* Redirect to Core pool if no route matches */}
        <Route path="*" element={<Redirect to={routes.landing.path} />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
