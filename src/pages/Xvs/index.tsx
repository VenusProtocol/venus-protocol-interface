/** @jsxImportSource @emotion/react */
import React from 'react';

import { Notice } from 'components';
import { useTranslation } from 'packages/translations';

import Header from './Header';
import Table from './Table';
import { useStyles } from './styles';

const Xvs: React.FC = () => {
  const { t } = useTranslation();
  const styles = useStyles();

  return (
    <div>
      <Notice
        css={styles.isolatedAssetsWarningNotice}
        variant="warning"
        description={t('xvsPage.isolatedAssetsWarning')}
      />

      <Header css={styles.header} />
      <Table />
    </div>
  );
};

export default Xvs;
