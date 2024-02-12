/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import BigNumber from 'bignumber.js';

import { PrimaryButton } from 'components';
import { ConnectWallet } from 'containers/ConnectWallet';
import useConvertMantissaToReadableTokenString from 'hooks/useConvertMantissaToReadableTokenString';
import { displayMutationError } from 'packages/errors';
import { useLunaUstWarning } from 'packages/lunaUstWarning';
import { useGetToken } from 'packages/tokens';
import { useTranslation } from 'packages/translations';

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

  const { userHasLunaOrUstCollateralEnabled, openLunaUstWarningModal } = useLunaUstWarning();

  const readableXvsAvailable = useConvertMantissaToReadableTokenString({
    value: xvsWithdrawableAmount,
    token: xvs,
  });

  const onSubmit = async () => {
    // Block action is user has LUNA or UST enabled as collateral
    if (userHasLunaOrUstCollateralEnabled) {
      openLunaUstWarningModal();
      return;
    }

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
