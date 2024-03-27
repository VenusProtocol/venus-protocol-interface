/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import type BigNumber from 'bignumber.js';

import { PrimaryButton } from 'components';
import { ConnectWallet } from 'containers/ConnectWallet';
import useConvertMantissaToReadableTokenString from 'hooks/useConvertMantissaToReadableTokenString';
import { displayMutationError } from 'libs/errors';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';

import { useStyles } from '../styles';

export interface WithdrawProps {
  xvsWithdrawableAmount: BigNumber | undefined;
  withdrawXvs: () => Promise<unknown>;
  withdrawXvsLoading: boolean;
}

const Withdraw: React.FC<WithdrawProps> = ({
  xvsWithdrawableAmount,
  withdrawXvs,
  withdrawXvsLoading,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const readableXvsAvailable = useConvertMantissaToReadableTokenString({
    value: xvsWithdrawableAmount,
    token: xvs,
  });

  const onSubmit = async () => {
    try {
      await withdrawXvs();
    } catch (error) {
      displayMutationError({ error });
    }
  };

  return (
    <div css={styles.root}>
      <ConnectWallet message={t('convertVrt.connectWalletToWithdrawXvs')}>
        <section css={styles.title}>
          <Typography variant="h3">{readableXvsAvailable}</Typography>
          <Typography variant="small2">{t('convertVrt.withdrawableAmount')}</Typography>
        </section>
        <PrimaryButton
          disabled={
            !xvsWithdrawableAmount ||
            xvsWithdrawableAmount.isZero() ||
            xvsWithdrawableAmount.isNaN()
          }
          className="w-full"
          onClick={onSubmit}
          loading={withdrawXvsLoading}
        >
          {t('convertVrt.withdrawXvs')}
        </PrimaryButton>
      </ConnectWallet>
    </div>
  );
};

export default Withdraw;
