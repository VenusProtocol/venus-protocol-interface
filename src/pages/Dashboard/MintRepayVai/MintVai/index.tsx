/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';

import { convertWeiToCoins, convertCoinsToWei } from 'utilities/common';
import { AmountForm } from 'containers/AmountForm';
import { AuthContext } from 'context/AuthContext';
import { SecondaryButton, LabeledInlineContent, TokenTextField } from 'components';
import { useVaiUser } from 'hooks/useVaiUser';
import useGetVaiTreasuryPercentage from 'hooks/operations/queries/useGetVaiTreasuryPercentage';
import useMintVai from 'hooks/operations/mutations/useMintVai';
import toast from 'components/Basic/Toast';
import { VAI_SYMBOL } from '../constants';
import getReadableFeeVai from './getReadableFeeVai';
import { useStyles } from './styles';

export interface IMintVaiUiProps {
  disabled: boolean;
  isMintVaiLoading: boolean;
  onSubmit: (value: BigNumber) => void;
  limitWei?: BigNumber;
  mintFeePercentage?: number;
}

export const MintVaiUi: React.FC<IMintVaiUiProps> = ({
  disabled,
  limitWei,
  mintFeePercentage,
  isMintVaiLoading,
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

  const hasMintableVai = limitWei?.isGreaterThan(0) || false;

  const getReadableMintFee = React.useCallback(
    (valueWei: BigNumber | '') => {
      if (!mintFeePercentage) {
        return '-';
      }

      const readableFeeVai = !valueWei ? '0' : getReadableFeeVai({ valueWei, mintFeePercentage });
      return `${readableFeeVai} (${mintFeePercentage}%)`;
    },
    [mintFeePercentage],
  );

  return (
    <AmountForm onSubmit={onSubmit}>
      {({ values, setFieldValue, handleBlur, isValid }) => (
        <>
          <TokenTextField
            name="amount"
            css={styles.textField}
            tokenSymbol={VAI_SYMBOL}
            value={values.amount}
            onChange={amount => setFieldValue('amount', amount, true)}
            onBlur={handleBlur}
            maxWei={limitWei}
            disabled={disabled || isMintVaiLoading || !hasMintableVai}
            rightMaxButtonLabel="SAFE MAX"
          />

          <LabeledInlineContent
            css={styles.getRow({ isLast: false })}
            iconName={VAI_SYMBOL}
            label="Available VAI limit"
          >
            {readableVaiLimit}
          </LabeledInlineContent>

          <LabeledInlineContent
            css={styles.getRow({ isLast: true })}
            iconName="fee"
            label="Mint fee"
          >
            {getReadableMintFee(values.amount)}
          </LabeledInlineContent>

          <SecondaryButton
            css={styles.submitButton}
            type="submit"
            loading={isMintVaiLoading}
            disabled={disabled || !isValid}
          >
            Mint VAI
          </SecondaryButton>
        </>
      )}
    </AmountForm>
  );
};

const MintVai: React.FC = () => {
  const { account } = React.useContext(AuthContext);
  const { mintableVai } = useVaiUser();
  const { data: vaiTreasuryPercentage, isLoading: isGetVaiTreasuryPercentageLoading } =
    useGetVaiTreasuryPercentage();

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

  const onSubmit: IMintVaiUiProps['onSubmit'] = amountWei => {
    if (account) {
      mintVai({
        fromAccountAddress: account.address,
        amountWei,
      });
    }
  };

  return (
    <MintVaiUi
      disabled={!account || isGetVaiTreasuryPercentageLoading}
      limitWei={limitWei}
      mintFeePercentage={vaiTreasuryPercentage}
      isMintVaiLoading={isMintVaiLoading}
      onSubmit={onSubmit}
    />
  );
};

export default MintVai;
