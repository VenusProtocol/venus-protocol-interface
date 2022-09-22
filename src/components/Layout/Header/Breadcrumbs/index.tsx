/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import React, { useMemo } from 'react';
import { Link, useLocation, useRouteMatch } from 'react-router-dom';
import { useTranslation } from 'translation';

import { menuItems } from 'components/Layout/constants';
import { paths } from 'constants/routing';

import { useStyles } from './styles';

export interface PathNode {
  dom: string | React.ReactNode;
  href?: string;
}

const Breadcrumbs: React.FC = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const styles = useStyles();
  const assetMatch = useRouteMatch<{ address: string }>(paths.marketAsset);

  console.log(assetMatch);

  const pathNodes = useMemo(() => {
    const pathnameRoot = (pathname as string).split('/').slice(0, 2).join('/');
    const activeMenuItem = menuItems.find(item => item.href === pathnameRoot);

    const path = activeMenuItem
      ? [
          {
            href: pathnameRoot,
            dom: t(activeMenuItem.i18nKey),
          },
        ]
      : [];

    // TODO: add other nodes

    return path;
  }, [pathname]);

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
