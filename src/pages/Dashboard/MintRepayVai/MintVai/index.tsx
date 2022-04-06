/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';

import { convertWeiToCoins, convertCoinsToWei } from 'utilities/common';
import { AmountForm } from 'containers/AmountForm';
import { AuthContext } from 'context/AuthContext';
import { SecondaryButton, LabeledInlineContent, TokenTextField } from 'components';
import { useVaiUser } from 'hooks/useVaiUser';
import useGetVaiTreasuryPercentage from 'hooks/operations/queries/useGetVaiTreasuryPercentage';
import { VAI_SYMBOL } from '../constants';
import getReadableFeeVai from './getReadableFeeVai';
import { useStyles } from '../styles';

export interface IMintVaiUiProps {
  disabled: boolean;
  isMintVaiLoading: boolean;
  onSubmit: (value: BigNumber) => Promise<void>;
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
  // @TODO: check if we need to apply the 40% of user borrow balance limit like in the current app
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
      {({ values, setFieldValue, handleBlur, isSubmitting, isValid, touched }) => (
        <>
          <TokenTextField
            name="amount"
            css={styles.textField}
            tokenSymbol={VAI_SYMBOL}
            value={values.amount}
            onChange={amount => setFieldValue('amount', amount)}
            onBlur={handleBlur}
            maxWei={limitWei}
            disabled={disabled || isSubmitting || isMintVaiLoading}
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
            type="submit"
            loading={isSubmitting || isMintVaiLoading}
            disabled={disabled || !isValid || !touched.amount}
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

  // Convert limit into wei of VAI
  const limitWei = React.useMemo(
    () => convertCoinsToWei({ value: mintableVai, tokenSymbol: VAI_SYMBOL }),
    [mintableVai.toString()],
  );

  const onSubmit: IMintVaiUiProps['onSubmit'] = async value => {
    // TODO: call contract
    console.log('Amount to mint:', value.toString());
  };

  return (
    <MintVaiUi
      disabled={!account || isGetVaiTreasuryPercentageLoading}
      limitWei={limitWei}
      mintFeePercentage={vaiTreasuryPercentage}
      isMintVaiLoading={false}
      onSubmit={onSubmit}
    />
  );
};

export default MintVai;
