/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useTranslation } from 'translation';
import { ChainId } from 'types';

import useCopyToClipboard from 'hooks/useCopyToClipboard';

import { BscLink } from '../../BscLink';
import { SecondaryButton } from '../../Button';
import { EllipseAddress } from '../../EllipseAddress';
import { Icon } from '../../Icon';
import { useStyles } from './styles';

export interface AccountDetailsProps {
  onLogOut: () => void;
  accountAddress: string;
  chainId: ChainId;
}

export const AccountDetails: React.FC<AccountDetailsProps> = ({
  onLogOut,
  accountAddress,
  chainId,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const copyToClipboard = useCopyToClipboard(t('interactive.copy.walletAddress'));

  return (
    <div css={styles.container}>
      <div css={styles.infoContainer}>
        <div css={styles.infoRightColumn}>
          <div css={styles.accountAddressContainer}>
            <Typography component="span" css={styles.accountAddress}>
              <EllipseAddress ellipseBreakpoint="md" address={accountAddress} />
            </Typography>

            <button
              onClick={() => copyToClipboard(accountAddress)}
              type="button"
              css={styles.copyButton}
            >
              <Icon name="copy" css={styles.copyButtonIcon} />
            </button>
          </div>
        </div>
      </div>

      <BscLink css={styles.bscScanLinkContainer} hash={accountAddress} chainId={chainId} />

      <SecondaryButton onClick={onLogOut} className="w-full">
        {t('authModal.accountDetails.logOutButtonLabel')}
      </SecondaryButton>
    </div>
  );
};
