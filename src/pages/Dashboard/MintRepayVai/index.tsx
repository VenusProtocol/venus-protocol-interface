/** @jsxImportSource @emotion/react */
import Paper from '@mui/material/Paper';
import { Tabs } from 'components';
import React from 'react';
import { useTranslation } from 'translation';

import MintVai from './MintVai';
import RepayVai from './RepayVai';
import { useStyles } from './styles';

export interface IMintRepayVaiProps {
  className?: string;
}

const MintRepayVai: React.FC<IMintRepayVaiProps> = ({ className }) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const tabsContent = [
    { title: t('mintRepayVai.tabMint'), content: <MintVai /> },
    { title: t('mintRepayVai.tabRepay'), content: <RepayVai /> },
  ];

  return (
    <Paper className={className} css={styles.container}>
      <Tabs componentTitle={t('mintRepayVai.title')} tabsContent={tabsContent} />
    </Paper>
  );
};

export default MintRepayVai;
