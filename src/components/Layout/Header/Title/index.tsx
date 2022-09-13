/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import React, { useContext } from 'react';

import { BreadcrumbNavigationContext } from 'context/BreadcrumbNavigationContext';

const Title: React.FC = () => {
  const { pathNodes } = useContext(BreadcrumbNavigationContext);

  console.log(pathNodes);

  if (pathNodes.length === 0) {
    return null;
  }

  return (
    <Typography component="h1" variant="h3">
      {pathNodes.map((pathNode, index) =>
        index === pathNodes.length - 1 ? pathNode.dom : `/${pathNode.dom}`,
      )}
    </Typography>
  );
};

export default Title;
