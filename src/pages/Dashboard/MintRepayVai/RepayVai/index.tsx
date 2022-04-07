/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';

import { convertCoinsToWei } from 'utilities/common';
import { AmountForm } from 'containers/AmountForm';
import { AuthContext } from 'context/AuthContext';
import { SecondaryButton, LabeledInlineContent, TokenTextField } from 'components';
import { useVaiUser } from 'hooks/useVaiUser';
import useRepayVai from 'hooks/operations/mutations/useRepayVai';
import toast from 'components/Basic/Toast';
import useConvertToReadableCoinString from '../useConvertToReadableCoinString';
import { VAI_SYMBOL } from '../constants';
import { useStyles } from '../styles';

export interface IRepayVaiUiProps {
  disabled: boolean;
  isRepayVaiLoading: boolean;
  onSubmit: (value: BigNumber) => void;
  userWeiBalance?: BigNumber;
  mintedWei?: BigNumber;
}

export const RepayVaiUi: React.FC<IRepayVaiUiProps> = ({
  disabled,
  userWeiBalance,
  mintedWei,
  isRepayVaiLoading,
  onSubmit,
}) => {
  const limitWei = React.useMemo(
    () =>
      userWeiBalance && mintedWei ? BigNumber.minimum(userWeiBalance, mintedWei) : new BigNumber(0),
    [userWeiBalance?.toString(), mintedWei?.toString()],
  );

  const styles = useStyles();

  // Convert minted wei into VAI
  const readableRepayableVai = useConvertToReadableCoinString({
    valueWei: mintedWei,
    tokenSymbol: VAI_SYMBOL,
  });

  const hasRepayableVai = mintedWei?.isGreaterThan(0) || false;

  return (
    <AmountForm onSubmit={onSubmit} css={styles.tabContentContainer}>
      {({ values, setFieldValue, handleBlur, isValid }) => (
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
            disabled={disabled || !isValid}
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

  const { mutate: repayVai, isLoading: isRepayVaiLoading } = useRepayVai({
    onError: error => {
      toast.error({ title: error.message });
    },
  });

  // Convert minted VAI balance into wei of VAI
  const mintedWei = React.useMemo(
    () => convertCoinsToWei({ value: userVaiBalance, tokenSymbol: VAI_SYMBOL }),
    [userVaiBalance.toString()],
  );

  // Convert user VAI balance into wei of VAI
  const userWeiBalance = React.useMemo(
    () => convertCoinsToWei({ value: userVaiMinted, tokenSymbol: VAI_SYMBOL }),
    [userVaiMinted.toString()],
  );

  const onSubmit: IRepayVaiUiProps['onSubmit'] = amountWei => {
    if (account) {
      repayVai({
        fromAccountAddress: account.address,
        amountWei,
      });
    }
  };

  // @TODO: wrap with EnableToken component once created
  return (
    <RepayVaiUi
      disabled={!account}
      userWeiBalance={userWeiBalance}
      mintedWei={mintedWei}
      isRepayVaiLoading={isRepayVaiLoading}
      onSubmit={onSubmit}
    />
  );
};

export default RepayVai;
