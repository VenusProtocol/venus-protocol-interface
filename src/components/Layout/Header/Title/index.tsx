/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { BreadcrumbNavigationContext } from 'context/BreadcrumbNavigationContext';

import { useStyles } from './styles';

const Title: React.FC = () => {
  const styles = useStyles();
  const { pathNodes } = useContext(BreadcrumbNavigationContext);

  if (pathNodes.length === 0) {
    return null;
  }

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

export default Title;
