/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';

import { AuthContext } from 'context/AuthContext';
import { convertCoinsToWei, convertWeiToCoins } from 'utilities/common';
import { AmountForm, IAmountFormProps } from 'containers/AmountForm';
import { SecondaryButton, LabeledInlineContent, TokenTextField } from 'components';
import { useVaiUser } from 'hooks/useVaiUser';
import { useGetVaiTreasuryPercentage } from 'clients/api';
import useMintVai from 'clients/api/mutations/useMintVai';
import toast from 'components/Basic/Toast';
import useConvertToReadableCoinString from '../useConvertToReadableCoinString';
import { VAI_SYMBOL } from '../constants';
import getReadableFeeVai from './getReadableFeeVai';
import { useStyles } from '../styles';

export interface IMintVaiUiProps {
  disabled: boolean;
  isMintVaiLoading: boolean;
  mintVai: (value: BigNumber) => Promise<void>;
  limitWei?: BigNumber;
  mintFeePercentage?: number;
}

export const MintVaiUi: React.FC<IMintVaiUiProps> = ({
  disabled,
  limitWei,
  mintFeePercentage,
  isMintVaiLoading,
  mintVai,
}) => {
  const styles = useStyles();

  // Convert limit into VAI
  const readableVaiLimit = useConvertToReadableCoinString({
    valueWei: limitWei,
    tokenSymbol: VAI_SYMBOL,
  });

  const hasMintableVai = limitWei?.isGreaterThan(0) || false;

  const getReadableMintFee = React.useCallback(
    (valueWei: BigNumber | '') => {
      if (!mintFeePercentage) {
        return '-';
      }

      const readableFeeVai = getReadableFeeVai({
        valueWei: valueWei || new BigNumber(0),
        mintFeePercentage,
      });
      return `${readableFeeVai} (${mintFeePercentage}%)`;
    },
    [mintFeePercentage],
  );

  const onSubmit: IAmountFormProps['onSubmit'] = async amountWei => {
    try {
      // Send request to repay VAI
      await mintVai(amountWei);

      // @TODO: display success modal instead of toast once it's been
      // implemented
      toast.success({
        title: `You successfully minted ${convertWeiToCoins({
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
          </div>

          <SecondaryButton
            type="submit"
            loading={isMintVaiLoading}
            disabled={disabled || !isValid || !dirty}
            fullWidth
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

  const { mutate: contractMintVai, isLoading: isMintVaiLoading } = useMintVai();

  // Convert limit into wei of VAI
  const limitWei = React.useMemo(
    () => convertCoinsToWei({ value: mintableVai, tokenSymbol: VAI_SYMBOL }),
    [mintableVai.toString()],
  );

  const mintVai: IMintVaiUiProps['mintVai'] = async amountWei => {
    if (!account) {
      // This error should never happen, since the form inside the UI component
      // is disabled if there's no logged in account
      throw new Error('An internal error occurred: account undefined. Please try again later.');
    }

    return contractMintVai({
      fromAccountAddress: account.address,
      amountWei,
    });
  };

  return (
    <MintVaiUi
      disabled={!account || isGetVaiTreasuryPercentageLoading}
      limitWei={limitWei}
      mintFeePercentage={vaiTreasuryPercentage}
      isMintVaiLoading={isMintVaiLoading}
      mintVai={mintVai}
    />
  );
};

export default MintVai;
