/** @jsxImportSource @emotion/react */
import Paper from '@mui/material/Paper';
import { Tabs } from 'components';
import React from 'react';
import { useTranslation } from 'translation';

import MintVai from './MintVai';
import RepayVai from './RepayVai';
import { useStyles } from './styles';

export interface VaiProps {
  className?: string;
}

const Vai: React.FC<VaiProps> = ({ className }) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const tabsContent = [
    { title: t('vai.tabMint'), content: <MintVai /> },
    { title: t('vai.tabRepay'), content: <RepayVai /> },
  ];

  return (
    <div css={[styles.container]}>
      <Paper className={className} css={styles.tabs}>
        <Tabs tabsContent={tabsContent} />
      </Paper>
    </div>
  );
};

export default Vai;
