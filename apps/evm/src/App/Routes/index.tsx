import { useLayoutEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router';

import { PAGE_CONTAINER_ID } from 'constants/layout';
import { Subdirectory, routes } from 'constants/routing';
import { Layout } from 'containers/Layout';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useAccountAddress } from 'libs/wallet';

import { Redirect } from 'containers/Redirect';
import { safeLazyLoad } from 'utilities';
import PageSuspense from './PageSuspense';

const Dashboard = safeLazyLoad(() => import('pages/Dashboard'));
const Account = safeLazyLoad(() => import('pages/Account'));
const Port = safeLazyLoad(() => import('pages/Port'));
const Pool = safeLazyLoad(() => import('pages/Pool'));
const Market = safeLazyLoad(() => import('pages/Market'));
const Governance = safeLazyLoad(() => import('pages/Governance'));
const Pools = safeLazyLoad(() => import('pages/Pools'));
const Proposal = safeLazyLoad(() => import('pages/Proposal'));
const Swap = safeLazyLoad(() => import('pages/Swap'));
const Vai = safeLazyLoad(() => import('pages/Vai'));
const Vaults = safeLazyLoad(() => import('pages/Vaults'));
const Voter = safeLazyLoad(() => import('pages/Voter'));
const VoterLeaderboard = safeLazyLoad(() => import('pages/VoterLeaderboard'));
const PrimeCalculator = safeLazyLoad(() => import('pages/PrimeCalculator'));
const Bridge = safeLazyLoad(() => import('pages/Bridge'));

const AppRoutes = () => {
  const { accountAddress } = useAccountAddress();
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

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path={Subdirectory.DASHBOARD}>
          <Route
            index
            element={
              <PageSuspense>
                <Dashboard />
              </PageSuspense>
            }
          />

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

          <Route path="*" element={<Redirect to={routes.dashboard.path} />} />
        </Route>

        {!!accountAddress && (
          <>
            <Route path={Subdirectory.ACCOUNT}>
              <Route
                index
                element={
                  <PageSuspense>
                    <Account />
                  </PageSuspense>
                }
              />

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
            </Route>

            <Route
              path={Subdirectory.PORT}
              element={
                <PageSuspense>
                  <Port />
                </PageSuspense>
              }
            />
          </>
        )}

        <Route path={Subdirectory.POOLS}>
          <Route
            index
            element={
              <PageSuspense>
                <Pools />
              </PageSuspense>
            }
          />

          <Route path={Subdirectory.POOL}>
            <Route
              index
              element={
                <PageSuspense>
                  <Pool />
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
        </Route>

        <Route path={Subdirectory.VAULTS}>
          <Route
            index
            element={
              <PageSuspense>
                <Vaults />
              </PageSuspense>
            }
          />

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

        {/* Redirect to Dashboard if no route matches */}
        <Route index element={<Redirect to={routes.dashboard.path} />} />
        <Route path="*" element={<Redirect to={routes.dashboard.path} />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
