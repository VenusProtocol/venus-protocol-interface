/** @jsxImportSource @emotion/react */
import React, { useContext } from 'react';
import BigNumber from 'bignumber.js';
import type { TransactionReceipt } from 'web3-core';

import { convertCoinsToWei, convertWeiToCoins, formatCoinsToReadableValue } from 'utilities/common';
import { internalError } from 'utilities/getError';
import { AmountForm, IAmountFormProps } from 'containers/AmountForm';
import { AuthContext } from 'context/AuthContext';
import { SecondaryButton, LabeledInlineContent, TokenTextField } from 'components';
import { useVaiUser } from 'hooks/useVaiUser';
import { useRepayVai } from 'clients/api';
import toast from 'components/Basic/Toast';
import { useTranslation } from 'translation';
import useConvertToReadableCoinString from '../useConvertToReadableCoinString';
import { VAI_ID } from '../constants';
import { useStyles } from '../styles';

export interface IRepayVaiUiProps {
  disabled: boolean;
  isRepayVaiLoading: boolean;
  repayVai: (amountWei: BigNumber) => Promise<TransactionReceipt>;
  userBalanceWei?: BigNumber;
  userMintedWei?: BigNumber;
}

export const RepayVaiUi: React.FC<IRepayVaiUiProps> = ({
  disabled,
  userBalanceWei,
  userMintedWei,
  isRepayVaiLoading,
  repayVai,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const limitTokens = React.useMemo(() => {
    const limitWei =
      userBalanceWei && userMintedWei
        ? BigNumber.minimum(userBalanceWei, userMintedWei)
        : new BigNumber(0);

    return convertWeiToCoins({ value: limitWei, tokenId: VAI_ID }).toString();
  }, [userBalanceWei?.toString(), userMintedWei?.toString()]);

  // Convert minted wei into VAI
  const readableRepayableVai = useConvertToReadableCoinString({
    valueWei: userMintedWei,
    tokenId: VAI_ID,
  });

  const hasRepayableVai = userMintedWei?.isGreaterThan(0) || false;

  const onSubmit: IAmountFormProps['onSubmit'] = async amountTokens => {
    const formattedAmountTokens = new BigNumber(amountTokens);

    const amountWei = convertCoinsToWei({
      value: formattedAmountTokens,
      tokenId: VAI_ID,
    });

    try {
      // Send request to repay VAI
      await repayVai(amountWei);

      // @TODO: display success modal instead of toast once it's been
      // implemented
      const readableAmountTokens = formatCoinsToReadableValue({
        value: formattedAmountTokens,
        tokenId: VAI_ID,
      });

      toast.success({
        title: t('mintRepayVai.repayVai.successMessage', {
          tokens: readableAmountTokens,
        }),
      });
    } catch (error) {
      toast.error({ title: (error as Error).message });
    }
  };

  return (
    <AmountForm onSubmit={onSubmit} css={styles.tabContentContainer}>
      {({ values, setFieldValue, handleBlur, isValid, dirty }) => (
        <>
          <div css={styles.ctaContainer}>
            <TokenTextField
              name="amount"
              css={styles.textField}
              tokenId={VAI_ID}
              value={values.amount}
              onChange={amount => setFieldValue('amount', amount, true)}
              onBlur={handleBlur}
              max={limitTokens}
              disabled={disabled || isRepayVaiLoading || !hasRepayableVai}
              rightMaxButtonLabel={t('mintRepayVai.repayVai.rightMaxButtonLabel')}
            />

            <LabeledInlineContent
              css={styles.getRow({ isLast: true })}
              iconName={VAI_ID}
              label={t('mintRepayVai.repayVai.repayVaiBalance')}
            >
              {readableRepayableVai}
            </LabeledInlineContent>
          </div>

          <SecondaryButton
            type="submit"
            loading={isRepayVaiLoading}
            disabled={disabled || !isValid || !dirty}
            fullWidth
          >
            {t('mintRepayVai.repayVai.btnRepayVai')}
          </SecondaryButton>
        </>
      )}
    </AmountForm>
  );
};

const RepayVai: React.FC = () => {
  const { account } = useContext(AuthContext);
  const { userVaiMinted, userVaiBalance } = useVaiUser();
  const { t } = useTranslation();

  const { mutateAsync: contractRepayVai, isLoading: isRepayVaiLoading } = useRepayVai();

  // Convert minted VAI balance into wei of VAI
  const userMintedWei = React.useMemo(
    () => convertCoinsToWei({ value: userVaiMinted, tokenId: VAI_ID }),
    [userVaiMinted.toString()],
  );

  // Convert user VAI balance into wei of VAI
  const userBalanceWei = React.useMemo(
    () => convertCoinsToWei({ value: userVaiBalance, tokenId: VAI_ID }),
    [userVaiBalance.toString()],
  );

  const repayVai: IRepayVaiUiProps['repayVai'] = amountWei => {
    if (!account) {
      const errorMessage = t('mintRepayVai.repayVai.undefinedAccountErrorMessage');
      // This error should never happen, since the form inside the UI component
      // is disabled if there's no logged in account
      throw internalError(errorMessage);
    }

    return contractRepayVai({
      fromAccountAddress: account.address,
      amountWei: amountWei.toString(),
    });
  };

  // @TODO: wrap with EnableToken component once created
  return (
    <RepayVaiUi
      disabled={!account}
      userBalanceWei={userBalanceWei}
      userMintedWei={userMintedWei}
      isRepayVaiLoading={isRepayVaiLoading}
      repayVai={repayVai}
    />
  );
};

export default RepayVai;
