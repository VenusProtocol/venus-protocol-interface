/** @jsxImportSource @emotion/react */
import React from 'react';
import { useHistory } from 'react-router-dom';

import { Icon } from '../../../../Icon';
import { useStyles } from './styles';

const BackButton: React.FC = ({ children }) => {
  const styles = useStyles();
  const history = useHistory();

  return (
    <div onClick={() => history.goBack()} css={styles.container}>
      <Icon name="chevronLeft" css={styles.icon} />

      {children}
    </div>
  );
};

export default BackButton;
