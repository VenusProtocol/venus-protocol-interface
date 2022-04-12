/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';

import { convertCoinsToWei, convertWeiToCoins } from 'utilities/common';
import { AmountForm, IAmountFormProps } from 'containers/AmountForm';
import { AuthContext } from 'context/AuthContext';
import { SecondaryButton, LabeledInlineContent, TokenTextField } from 'components';
import { useVaiUser } from 'hooks/useVaiUser';
import { useRepayVai } from 'clients/api';
import toast from 'components/Basic/Toast';
import useConvertToReadableCoinString from '../useConvertToReadableCoinString';
import { VAI_SYMBOL } from '../constants';
import { useStyles } from '../styles';

export interface IRepayVaiUiProps {
  disabled: boolean;
  isRepayVaiLoading: boolean;
  repayVai: (amountWei: BigNumber) => Promise<void>;
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
  const limitWei = React.useMemo(
    () =>
      userBalanceWei && userMintedWei
        ? BigNumber.minimum(userBalanceWei, userMintedWei)
        : new BigNumber(0),
    [userBalanceWei?.toString(), userMintedWei?.toString()],
  );

  const styles = useStyles();

  // Convert minted wei into VAI
  const readableRepayableVai = useConvertToReadableCoinString({
    valueWei: userMintedWei,
    tokenSymbol: VAI_SYMBOL,
  });

  const hasRepayableVai = userMintedWei?.isGreaterThan(0) || false;

  const onSubmit: IAmountFormProps['onSubmit'] = async amountWei => {
    try {
      // Send request to repay VAI
      await repayVai(amountWei);

      // @TODO: display success modal instead of toast once it's been
      // implemented
      toast.success({
        title: `You successfully repaid ${convertWeiToCoins({
          value: amountWei,
          tokenSymbol: VAI_SYMBOL,
          returnInReadableFormat: true,
        })}`,
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
              tokenSymbol={VAI_SYMBOL}
              value={values.amount}
              onChange={amount => setFieldValue('amount', amount, true)}
              onBlur={handleBlur}
              maxWei={limitWei}
              disabled={disabled || isRepayVaiLoading || !hasRepayableVai}
              rightMaxButtonLabel="MAX"
            />

            <LabeledInlineContent
              css={styles.getRow({ isLast: true })}
              iconName={VAI_SYMBOL}
              label="Repay VAI balance"
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
            Repay VAI
          </SecondaryButton>
        </>
      )}
    </AmountForm>
  );
};

const RepayVai: React.FC = () => {
  const { account } = React.useContext(AuthContext);
  const { userVaiMinted, userVaiBalance } = useVaiUser();

  const { mutateAsync: contractRepayVai, isLoading: isRepayVaiLoading } = useRepayVai();

  // Convert minted VAI balance into wei of VAI
  const userMintedWei = React.useMemo(
    () => convertCoinsToWei({ value: userVaiMinted, tokenSymbol: VAI_SYMBOL }),
    [userVaiMinted.toString()],
  );

  // Convert user VAI balance into wei of VAI
  const userBalanceWei = React.useMemo(
    () => convertCoinsToWei({ value: userVaiBalance, tokenSymbol: VAI_SYMBOL }),
    [userVaiBalance.toString()],
  );

  const repayVai: IRepayVaiUiProps['repayVai'] = amountWei => {
    if (!account) {
      // This error should never happen, since the form inside the UI component
      // is disabled if there's no logged in account
      throw new Error('An internal error occurred: account undefined. Please try again later.');
    }

    return contractRepayVai({
      fromAccountAddress: account.address,
      amountWei,
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
