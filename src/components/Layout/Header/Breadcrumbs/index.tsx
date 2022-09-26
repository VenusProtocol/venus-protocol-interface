/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import React, { useContext, useMemo } from 'react';
import { Link, matchPath, useLocation } from 'react-router-dom';
import { useTranslation } from 'translation';
import { TokenId } from 'types';
import { getToken } from 'utilities';

import addTokenToWallet from 'clients/web3/addTokenToWallet';
import { Subdirectory, routes } from 'constants/routing';
import { AuthContext } from 'context/AuthContext';
import useCopyToClipboard from 'hooks/useCopyToClipboard';

import { TertiaryButton } from '../../../Button';
import { EllipseAddress } from '../../../EllipseAddress';
import { Icon } from '../../../Icon';
import { useStyles } from './styles';

export interface PathNode {
  dom: React.ReactNode;
  href: string;
}

const Breadcrumbs: React.FC = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { account } = useContext(AuthContext);
  const styles = useStyles();
  const copyToClipboard = useCopyToClipboard(t('interactive.copy.walletAddress'));

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
        case Subdirectory.POOL:
          href += Subdirectory.POOL.replace(':poolId', params.poolId);
          break;
        case Subdirectory.MARKET:
          href += Subdirectory.MARKET.replace(':vTokenId', params.vTokenId);
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
        case Subdirectory.POOLS:
          dom = t('breadcrumbs.pools');
          break;
        case Subdirectory.POOL:
          // TODO: fetch actual value (see VEN-546)
          dom = <>Fake pool name</>;
          break;
        case Subdirectory.MARKET: {
          const token = getToken(params.vTokenId as TokenId);

          if (token) {
            dom = (
              <div css={styles.tokenSymbol}>
                <span>{token.symbol}</span>

                {!!account && (
                  <TertiaryButton
                    css={styles.addTokenButton}
                    onClick={() => addTokenToWallet(params.vTokenId as TokenId)}
                  >
                    <Icon name="wallet" css={styles.walletIcon} />
                  </TertiaryButton>
                )}
              </div>
            );
          }
          break;
        }
        case Subdirectory.GOVERNANCE:
          dom = t('breadcrumbs.governance');
          break;
        case Subdirectory.PROPOSAL:
          dom = t('breadcrumbs.proposal', { proposalId: params.proposalId });
          break;
        case Subdirectory.LEADER_BOARD:
          dom = t('breadcrumbs.leaderboard');
          break;
        case Subdirectory.VOTER:
          dom = (
            <div css={styles.address}>
              <Typography variant="h3" color="textPrimary">
                <EllipseAddress address={params.address} />
              </Typography>

              <Icon
                name="copy"
                css={styles.copyIcon}
                onClick={() => copyToClipboard(params.address)}
              />
            </div>
          );
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
  }, [pathname, t, !!account]);

  return (
    <Typography component="h1" variant="h3">
      {pathNodes.map((pathNode, index) => (
        <span key={`layout-header-breadcrumb-${pathNode.href}`}>
          {pathNodes.length > 0 && index < pathNodes.length - 1 ? (
            <>
              <Link to={pathNode.href}>{pathNode.dom}</Link>
              <span css={styles.separator}>/</span>
            </>
          ) : (
            pathNode.dom
          )}
        </span>
      ))}
    </Typography>
  );
};

export default Breadcrumbs;
