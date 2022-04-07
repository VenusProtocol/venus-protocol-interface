/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';

import { convertWeiToCoins, convertCoinsToWei } from 'utilities/common';
import { AmountForm } from 'containers/AmountForm';
import { AuthContext } from 'context/AuthContext';
import { SecondaryButton, LabeledInlineContent, TokenTextField } from 'components';
import { useVaiUser } from 'hooks/useVaiUser';
import useMintVai from 'hooks/operations/mutations/useMintVai';
import toast from 'components/Basic/Toast';
import { VAI_SYMBOL } from '../constants';
import { useStyles } from '../styles';

export interface IRepayVaiUiProps {
  disabled: boolean;
  isRepayVaiLoading: boolean;
  onSubmit: (value: BigNumber) => void;
  limitWei?: BigNumber;
}

export const RepayVaiUi: React.FC<IRepayVaiUiProps> = ({
  disabled,
  limitWei,
  isRepayVaiLoading,
  onSubmit,
}) => {
  const styles = useStyles();

  // Convert limit into VAI
  const readableVaiLimit = React.useMemo(
    () =>
      !limitWei
        ? '-'
        : convertWeiToCoins({
            value: limitWei,
            tokenSymbol: VAI_SYMBOL,
            returnInReadableFormat: true,
          }).toString(),
    [limitWei?.toString()],
  );

  const hasRepayableVai = limitWei?.isGreaterThan(0) || false;

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
              {readableVaiLimit}
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

  // @TODO: get user repayable VAI amount
  const { mintableVai } = useVaiUser();

  // @TODO: use useRepayVai hook
  const { mutate: mintVai, isLoading: isMintVaiLoading } = useMintVai({
    onError: error => {
      toast.error({ title: error.message });
    },
  });

  // Convert limit into wei of VAI
  const limitWei = React.useMemo(
    () => convertCoinsToWei({ value: mintableVai, tokenSymbol: VAI_SYMBOL }),
    [mintableVai.toString()],
  );

  const onSubmit: IRepayVaiUiProps['onSubmit'] = amountWei => {
    if (account) {
      mintVai({
        fromAccountAddress: account.address,
        amountWei,
      });
    }
  };

  // @TODO: wrap with EnableToken component once created
  return (
    <RepayVaiUi
      disabled={!account}
      limitWei={limitWei}
      isRepayVaiLoading={isMintVaiLoading}
      onSubmit={onSubmit}
    />
  );
};

export default RepayVai;
