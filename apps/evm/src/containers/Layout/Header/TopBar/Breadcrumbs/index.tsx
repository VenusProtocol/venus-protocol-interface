import { useMemo } from 'react';
import { matchPath, useLocation } from 'react-router';

import { cn } from '@venusprotocol/ui';
import { Username } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import { Subdirectory, routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { useChain } from 'hooks/useChain';
import { useFormatTo } from 'hooks/useFormatTo';
import { useTranslation } from 'libs/translations';
import { POOL_COMPTROLLER_ADDRESS_PARAM_KEY } from 'pages/IsolatedPools';
import { areAddressesEqual } from 'utilities';
import type { Address } from 'viem';
import PoolName from './PoolName';
import VTokenSymbol from './VTokenSymbol';

export interface PathNode {
  dom: React.ReactNode;
  href: string;
}

export const Breadcrumbs: React.FC = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { corePoolComptrollerContractAddress } = useChain();
  const { formatTo } = useFormatTo();

  const pathNodes = useMemo(() => {
    // Get active route
    let params: {
      poolComptrollerAddress?: Address;
      vTokenAddress?: Address;
      proposalId?: string;
      address?: Address;
    } = {};
    const activeRouteKey = Object.keys(routes).find(key => {
      const routeMatch = matchPath(routes[key as keyof typeof routes].path, pathname);

      if (routeMatch) {
        const { params: routeParams } = routeMatch;
        params = routeParams;
      }

      return !!routeMatch;
    });

    if (!activeRouteKey) {
      return [];
    }

    const activeRoute = routes[activeRouteKey as keyof typeof routes];
    let href = '';

    // Generate path nodes
    return activeRoute.subdirectories.reduce<PathNode[]>((acc, subdirectory) => {
      let dom: React.ReactNode;
      let hrefFragment: string = subdirectory;

      switch (subdirectory) {
        case Subdirectory.DASHBOARD:
          dom = t('breadcrumbs.dashboard');
          break;
        case Subdirectory.ISOLATED_POOLS:
          dom = t('breadcrumbs.isolatedPools');
          break;
        case Subdirectory.MARKETS:
          if (
            params.poolComptrollerAddress &&
            areAddressesEqual(params.poolComptrollerAddress, corePoolComptrollerContractAddress)
          ) {
            hrefFragment = Subdirectory.MARKETS.replace(
              ':poolComptrollerAddress',
              params.poolComptrollerAddress || '',
            );
          } else {
            const { search, pathname } = formatTo({
              to: {
                pathname: routes.isolatedPools.path,
                search: `${POOL_COMPTROLLER_ADDRESS_PARAM_KEY}=${params.poolComptrollerAddress}`,
              },
            });

            hrefFragment = `${pathname}/${search}`;
          }

          dom = <PoolName poolComptrollerAddress={params.poolComptrollerAddress || NULL_ADDRESS} />;
          break;
        case Subdirectory.MARKET: {
          hrefFragment = Subdirectory.MARKET.replace(':vTokenAddress', params.vTokenAddress || '');

          dom = <VTokenSymbol vTokenAddress={params.vTokenAddress} />;
          break;
        }
        case Subdirectory.GOVERNANCE:
          dom = t('breadcrumbs.governance');
          break;
        case Subdirectory.PROPOSAL:
          dom = t('breadcrumbs.proposal', {
            proposalId:
              params.proposalId && !Number.isNaN(+params.proposalId) ? params.proposalId : '',
          });
          break;
        case Subdirectory.LEADER_BOARD:
          dom = t('breadcrumbs.leaderboard');
          break;
        case Subdirectory.VOTER:
          hrefFragment = Subdirectory.VOTER.replace(':address', params.address || '');

          dom = !!params.address && (
            <div className="inline-flex items-center gap-x-2">
              <Username
                address={params.address}
                showProvider={false}
                showTooltip={false}
                showCopyAddress
                ellipseBreakpoint="xxl"
              />
            </div>
          );
          break;
        case Subdirectory.VAULTS:
          dom = t('breadcrumbs.vaults');
          break;
        case Subdirectory.SWAP:
          dom = t('breadcrumbs.swap');
          break;
        case Subdirectory.VAI:
          dom = t('breadcrumbs.vai');
          break;
        case Subdirectory.PRIME_CALCULATOR:
          dom = t('breadcrumbs.primeCalculator');
          break;
        case Subdirectory.BRIDGE:
          dom = t('breadcrumbs.bridge');
          break;
        default:
          break;
      }

      href += hrefFragment;

      return dom
        ? [
            ...acc,
            {
              href,
              dom,
            },
          ]
        : acc;
    }, []);
  }, [pathname, t, corePoolComptrollerContractAddress, formatTo]);

  const pathNodeDom = useMemo(
    () =>
      pathNodes.map((pathNode, index) => (
        <span
          key={`layout-header-breadcrumb-${pathNode.href}`}
          className="inline-flex items-center"
        >
          {pathNodes.length > 0 && index < pathNodes.length - 1 ? (
            <>
              <Link
                className="text-grey hover:text-offWhite transition-colors hover:no-underline"
                to={pathNode.href}
              >
                {pathNode.dom}
              </Link>

              <span className="text-grey mx-2">/</span>
            </>
          ) : (
            <span className="font-bold">{pathNode.dom}</span>
          )}
        </span>
      )),
    [pathNodes],
  );

  return (
    <span className={cn('flex flex-wrap items-center', pathNodes.length === 1 && 'text-xl')}>
      {pathNodeDom}
    </span>
  );
};
