/** @jsxImportSource @emotion/react */
import { Notice } from 'components';
import React from 'react';
import { useTranslation } from 'translation';
import { isFeatureEnabled } from 'utilities';

import Header from './Header';
import Table from './Table';
import { useStyles } from './styles';

const Xvs: React.FC = () => {
  const { t } = useTranslation();
  const styles = useStyles();

  return (
    <div>
      {isFeatureEnabled('isolatedPools') && (
        <Notice
          css={styles.isolatedAssetsWarningNotice}
          variant="warning"
          description={t('xvsPage.isolatedAssetsWarning')}
        />
      )}

      <Header css={styles.header} />
      <Table />
    </div>
  );
};

export default Xvs;
