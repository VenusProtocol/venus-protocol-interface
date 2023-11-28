/** @jsxImportSource @emotion/react */
import Paper from '@mui/material/Paper';
import React from 'react';

import { Tabs } from 'components';
import { useTranslation } from 'packages/translations';

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
    <Paper className={className} css={styles.container}>
      <Tabs tabsContent={tabsContent} />
    </Paper>
  );
};

export default Vai;
