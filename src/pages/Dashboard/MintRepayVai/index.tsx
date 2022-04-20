/** @jsxImportSource @emotion/react */
import React from 'react';

import { Tabs } from 'components';
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

  return (
    <div className={className} css={styles.container}>
      <Tabs
        componentTitle={t('mintRepayVai.title')}
        tabTitles={[t('mintRepayVai.tabMint'), t('mintRepayVai.tabRepay')]}
        tabsContent={[<MintVai />, <RepayVai />]}
      />
    </div>
  );
};

export default MintRepayVai;
