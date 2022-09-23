/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import React, { useMemo } from 'react';
import { Link, matchPath, useLocation } from 'react-router-dom';
import { useTranslation } from 'translation';

import { Subdirectory, routes } from 'constants/routing';

import { useStyles } from './styles';

export interface PathNode {
  dom: React.ReactNode;
  href?: string;
}

const Breadcrumbs: React.FC = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const styles = useStyles();

  const pathNodes = useMemo(() => {
    // Get active route
    let params: Record<string, string> = {};
    const activeRouteKey = Object.keys(routes).find(key => {
      const routeMatch = matchPath(pathname, {
        path: routes[key as keyof typeof routes].path,
        exact: true,
      });

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

      // Update href
      switch (subdirectory) {
        case Subdirectory.MARKET:
          href += Subdirectory.MARKET.replace(':marketId', params.marketId);
          break;
        case Subdirectory.ASSET:
          href += Subdirectory.ASSET.replace(':marketId', params.marketId).replace(
            ':vTokenId',
            params.vTokenId,
          );
          break;
        case Subdirectory.VOTER:
          href += Subdirectory.VOTER.replace(':address', params.address);
          break;
        default:
          href += subdirectory;
          break;
      }

      switch (subdirectory) {
        case Subdirectory.DASHBOARD:
          dom = t('breadcrumbs.dashboard');
          break;
        case Subdirectory.ACCOUNT:
          dom = t('breadcrumbs.account');
          break;
        case Subdirectory.MARKETS:
          dom = t('breadcrumbs.markets');
          break;
        case Subdirectory.MARKET:
          dom = <></>;
          break;
        case Subdirectory.ASSET:
          dom = <></>;
          break;
        case Subdirectory.GOVERNANCE:
          dom = t('breadcrumbs.governance');
          break;
        case Subdirectory.LEADER_BOARD:
          dom = t('breadcrumbs.leaderboard');
          break;
        case Subdirectory.VOTER:
          dom = <></>;
          break;
        case Subdirectory.VAULTS:
          dom = t('breadcrumbs.vaults');
          break;
        case Subdirectory.HISTORY:
          dom = t('breadcrumbs.history');
          break;
        case Subdirectory.XVS:
          dom = t('breadcrumbs.xvs');
          break;
        case Subdirectory.CONVERT_VRT:
          dom = t('breadcrumbs.convertVrt');
          break;
        case Subdirectory.VAI:
          dom = t('breadcrumbs.vai');
          break;
        default:
          break;
      }

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

  return (
    <Typography component="h1" variant="h3">
      {pathNodes.map((pathNode, index) =>
        pathNodes.length > 0 && index < pathNodes.length - 1 ? (
          <>
            <Link to={pathNode.href}>{pathNode.dom}</Link>
            <span css={styles.separator}>/</span>
          </>
        ) : (
          pathNode.dom
        ),
      )}
    </Typography>
  );
};

export default Breadcrumbs;
