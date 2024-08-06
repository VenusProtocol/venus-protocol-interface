import { lazy, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import { PAGE_CONTAINER_ID } from 'constants/layout';
import { Subdirectory, routes } from 'constants/routing';
import { Layout } from 'containers/Layout';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useAccountAddress } from 'libs/wallet';

import { Redirect } from 'components';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import PageSuspense from './PageSuspense';

const Dashboard = lazy(() => import('pages/Dashboard'));
const Account = lazy(() => import('pages/Account'));
const CorePoolMarket = lazy(() => import('pages/Market/CorePoolMarket'));
const IsolatedPoolMarket = lazy(() => import('pages/Market/IsolatedPoolMarket'));
const CorePool = lazy(() => import('pages/Pool/CorePool'));
const IsolatedPool = lazy(() => import('pages/Pool/IsolatedPool'));
const LidoMarket = lazy(() => import('pages/Market/LidoMarket'));
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
const PrimeCalculator = lazy(() => import('pages/PrimeCalculator'));
const Bridge = lazy(() => import('pages/Bridge'));

const AppRoutes = () => {
  const { accountAddress } = useAccountAddress();
  const { stakedEthPoolComptrollerContractAddress, wstEthContractAddress } = useGetChainMetadata();
  const swapRouteEnabled = useIsFeatureEnabled({ name: 'swapRoute' });
  const historyRouteEnabled = useIsFeatureEnabled({ name: 'historyRoute' });
  const convertVrtRouteEnabled = useIsFeatureEnabled({ name: 'convertVrtRoute' });
  const vaiRouteEnabled = useIsFeatureEnabled({ name: 'vaiRoute' });
  const xvsRouteEnabled = useIsFeatureEnabled({ name: 'xvsRoute' });
  const bridgeEnabled = useIsFeatureEnabled({ name: 'bridgeRoute' });
  const primeCalculatorEnabled = useIsFeatureEnabled({
    name: 'primeCalculator',
  });
  const location = useLocation();

  // Scroll to the top of the page on route change
  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    document.getElementById(PAGE_CONTAINER_ID)?.scrollTo(0, 0);
  }, [location]);

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
        )}

        <Route path={Subdirectory.ISOLATED_POOLS}>
          <Route
            index
            element={
              <PageSuspense>
                <IsolatedPools />
              </PageSuspense>
            }
          />

          <Route path={Subdirectory.ISOLATED_POOL}>
            <Route
              index
              element={
                <PageSuspense>
                  <IsolatedPool />
                </PageSuspense>
              }
            />

            <Route
              path={Subdirectory.MARKET}
              element={
                <PageSuspense>
                  <IsolatedPoolMarket />
                </PageSuspense>
              }
            />
          </Route>
        </Route>

        <Route path={Subdirectory.CORE_POOL}>
          <Route
            index
            element={
              <PageSuspense>
                <CorePool />
              </PageSuspense>
            }
          />

          <Route
            path={Subdirectory.MARKET}
            element={
              <PageSuspense>
                <CorePoolMarket />
              </PageSuspense>
            }
          />
        </Route>

        {!!stakedEthPoolComptrollerContractAddress && !!wstEthContractAddress && (
          <Route path={Subdirectory.LIDO_MARKET}>
            <Route
              index
              element={
                <PageSuspense>
                  <LidoMarket />
                </PageSuspense>
              }
            />
          </Route>
        )}

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

        {historyRouteEnabled && (
          <Route
            path={Subdirectory.HISTORY}
            element={
              <PageSuspense>
                <History />
              </PageSuspense>
            }
          />
        )}

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

        {xvsRouteEnabled && (
          <Route
            path={Subdirectory.XVS}
            element={
              <PageSuspense>
                <Xvs />
              </PageSuspense>
            }
          />
        )}

        {convertVrtRouteEnabled && (
          <Route
            path={Subdirectory.CONVERT_VRT}
            element={
              <PageSuspense>
                <ConvertVrt />
              </PageSuspense>
            }
          />
        )}

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
