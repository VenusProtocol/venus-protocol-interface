/** @jsxImportSource @emotion/react */
import { NoticeInfo } from 'components';
import * as React from 'react';
import { useTranslation } from 'translation';

import { useStyles } from '../styles';

const Convert: React.FC = () => {
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <div css={styles.root}>
      <div css={styles.notice}>
        <NoticeInfo description={t('convertVrt.infoConversionCompleted')} />
      </div>
    </div>
  );
};

export default Convert;
