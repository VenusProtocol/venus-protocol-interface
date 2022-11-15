/** @jsxImportSource @emotion/react */
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Icon } from 'components';
import React, { useState } from 'react';
import { useTranslation } from 'translation';

import { LS_KEY_HIDE_HIGHER_RISK_TOKENS_NOTICE } from 'constants/localStorageKeys';

import { useStyles } from './styles';

export interface HigherRiskTokensNoticeUiProps {
  isVisible: boolean;
  onHide: () => void;
}

export const HigherRiskTokensNoticeUi: React.FC<HigherRiskTokensNoticeUiProps> = ({
  onHide,
  isVisible,
  ...containerProps
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  if (!isVisible) {
    return null;
  }

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
  const [isVisible, setIsVisible] = useState(
    !window.localStorage.getItem(LS_KEY_HIDE_HIGHER_RISK_TOKENS_NOTICE),
  );

  const handleHide = () => {
    setIsVisible(false);
    window.localStorage.setItem(LS_KEY_HIDE_HIGHER_RISK_TOKENS_NOTICE, 'true');
  };

  return <HigherRiskTokensNoticeUi isVisible={isVisible} onHide={handleHide} />;
};

export default HigherRiskTokensNotice;
