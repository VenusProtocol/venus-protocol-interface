import { useMemo } from 'react';
import { type Params, matchPath, useLocation } from 'react-router-dom';

import { Username } from 'components';
import { Subdirectory, routes } from 'constants/routing';
import { CopyAddressButton } from 'containers/CopyAddressButton';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';
import { cn } from 'utilities';
import PoolName from './PoolName';
import VTokenSymbol from './VTokenSymbol';

export interface PathNode {
  dom: React.ReactNode;
  href: string;
}

export const Breadcrumbs: React.FC = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const pathNodes = useMemo(() => {
    // Get active route
    let params: Params<string> = {};
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
        case Subdirectory.ACCOUNT:
          dom = t('breadcrumbs.account');
          break;
        case Subdirectory.MARKETS:
          hrefFragment = Subdirectory.MARKETS.replace(
            ':poolComptrollerAddress',
            params.poolComptrollerAddress || '',
          );

          dom = t('breadcrumbs.markets');
          break;
        case Subdirectory.ISOLATED_POOLS:
          dom = t('breadcrumbs.isolatedPools');
          break;
        case Subdirectory.ISOLATED_POOL:
          hrefFragment = Subdirectory.ISOLATED_POOL.replace(
            ':poolComptrollerAddress',
            params.poolComptrollerAddress || '',
          );

          dom = <PoolName poolComptrollerAddress={params.poolComptrollerAddress || ''} />;
          break;
        case Subdirectory.CORE_POOL:
          dom = t('breadcrumbs.corePool');
          break;
        case Subdirectory.LIDO_MARKET:
          dom = t('breadcrumbs.lidoMarket');
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
                ellipseBreakpoint="xxl"
              />

              {<CopyAddressButton address={params.address} />}
            </div>
          );
          break;
        case Subdirectory.VAULTS:
          dom = t('breadcrumbs.vaults');
          break;
        case Subdirectory.XVS:
          dom = t('breadcrumbs.xvs');
          break;
        case Subdirectory.CONVERT_VRT:
          dom = t('breadcrumbs.convertVrt');
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

      href += `${hrefFragment}/`;

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
  }, [pathname, t]);

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
