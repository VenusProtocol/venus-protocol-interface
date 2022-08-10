/** @jsxImportSource @emotion/react */
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Icon } from 'components';
import React, { useState } from 'react';
import { useTranslation } from 'translation';

import { useStyles } from './styles';

export interface HigherRiskTokensNoticeUiProps {
  isVisible: boolean;
  onHide: () => void;
}

export const HigherRiskTokensNoticeUi: React.FC<HigherRiskTokensNoticeUiProps> = ({
  onHide,
  ...containerProps
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  return (
    <Paper css={styles.container} {...containerProps}>
      <div css={styles.content}>
        <Icon name="gauge" css={styles.icon} />

        <div css={styles.textContainer}>
          <Typography variant="h4" css={styles.title}>
            {t('dashboard.higherRiskTokensNotice.title')}
          </Typography>

          <Typography>{t('dashboard.higherRiskTokensNotice.description')}</Typography>
        </div>
      </div>

      <button css={styles.closeButton} onClick={onHide} type="button">
        <Icon name="close" />
      </button>
    </Paper>
  );
};

const HigherRiskTokensNotice: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleHide = () => setIsVisible(false);

  return <HigherRiskTokensNoticeUi isVisible={isVisible} onHide={handleHide} />;
};

export default HigherRiskTokensNotice;
