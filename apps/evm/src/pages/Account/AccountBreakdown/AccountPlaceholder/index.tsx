/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';

import { ButtonWrapper } from 'components';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';

import { useStyles } from './styles';
import wallet from './wallet.png';

const AccountPlaceholder: React.FC = () => {
  const { t } = useTranslation();
  const styles = useStyles();

  return (
    <div css={styles.placeholderContainer}>
      <div>
        <img
          src={wallet}
          css={styles.wallet}
          alt={t('dashboard.connectWalletBanner.illustration.alt')}
        />
      </div>

      <Typography css={styles.placeholderText} variant="h4">
        {t('accountPlaceholder.assetsWillAppearHere')}
      </Typography>

      <ButtonWrapper asChild>
        <Link to={routes.dashboard.path} className="text-offWhite hover:no-underline">
          {t('accountPlaceholder.letsGetStarted')}
        </Link>
      </ButtonWrapper>
    </div>
  );
};

export default AccountPlaceholder;
