import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import { PAGE_CONTAINER_ID } from 'constants/layout';
import { Subdirectory, routes } from 'constants/routing';
import { Layout } from 'containers/Layout';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useAccountAddress } from 'libs/wallet';

import { Redirect } from 'containers/Redirect';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { safeLazyLoad } from 'utilities';
import PageSuspense from './PageSuspense';

const Dashboard = safeLazyLoad(() => import('pages/Dashboard'));
const Account = safeLazyLoad(() => import('pages/Account'));
const CorePoolMarket = safeLazyLoad(() => import('pages/Market/CorePoolMarket'));
const IsolatedPoolMarket = safeLazyLoad(() => import('pages/Market/IsolatedPoolMarket'));
const CorePool = safeLazyLoad(() => import('pages/Pool/CorePool'));
const IsolatedPool = safeLazyLoad(() => import('pages/Pool/IsolatedPool'));
const LidoMarket = safeLazyLoad(() => import('pages/Market/LidoMarket'));
const ConvertVrt = safeLazyLoad(() => import('pages/ConvertVrt'));
const Governance = safeLazyLoad(() => import('pages/Governance'));
const IsolatedPools = safeLazyLoad(() => import('pages/IsolatedPools'));
const Proposal = safeLazyLoad(() => import('pages/Proposal'));
const Swap = safeLazyLoad(() => import('pages/Swap'));
const Vai = safeLazyLoad(() => import('pages/Vai'));
const Vaults = safeLazyLoad(() => import('pages/Vault'));
const Voter = safeLazyLoad(() => import('pages/Voter'));
const VoterLeaderboard = safeLazyLoad(() => import('pages/VoterLeaderboard'));
const PrimeCalculator = safeLazyLoad(() => import('pages/PrimeCalculator'));
const Bridge = safeLazyLoad(() => import('pages/Bridge'));

const AppRoutes = () => {
  const { accountAddress } = useAccountAddress();
  const { lstPoolComptrollerContractAddress, lstPoolVWstEthContractAddress } =
    useGetChainMetadata();
  const swapRouteEnabled = useIsFeatureEnabled({ name: 'swapRoute' });
  const convertVrtRouteEnabled = useIsFeatureEnabled({ name: 'convertVrtRoute' });
  const vaiRouteEnabled = useIsFeatureEnabled({ name: 'vaiRoute' });
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

        {!!lstPoolComptrollerContractAddress && !!lstPoolVWstEthContractAddress && (
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
