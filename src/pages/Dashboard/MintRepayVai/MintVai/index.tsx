/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';

import { AuthContext } from 'context/AuthContext';
import { convertCoinsToWei, convertWeiToCoins, formatCoinsToReadableValue } from 'utilities/common';
import { internalError } from 'utilities/getError';
import { AmountForm, IAmountFormProps } from 'containers/AmountForm';
import { SecondaryButton, LabeledInlineContent, TokenTextField } from 'components';
import { useVaiUser } from 'hooks/useVaiUser';
import { useGetVaiTreasuryPercentage, useMintVai } from 'clients/api';
import toast from 'components/Basic/Toast';
import { useTranslation } from 'translation';
import useConvertToReadableCoinString from '../useConvertToReadableCoinString';
import { VAI_ID } from '../constants';
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
  const { t } = useTranslation();

  const limitTokens = React.useMemo(
    () => (limitWei ? convertWeiToCoins({ value: limitWei, tokenId: VAI_ID }).toString() : '0'),
    [limitWei?.toString()],
  );

  // Convert limit into VAI
  const readableVaiLimit = useConvertToReadableCoinString({
    valueWei: limitWei,
    tokenId: VAI_ID,
  });

  const hasMintableVai = limitWei?.isGreaterThan(0) || false;

  const getReadableMintFee = React.useCallback(
    (valueWei: string) => {
      if (!mintFeePercentage) {
        return '-';
      }

      const readableFeeVai = getReadableFeeVai({
        valueWei: new BigNumber(valueWei || 0),
        mintFeePercentage,
      });
      return `${readableFeeVai} (${mintFeePercentage}%)`;
    },
    [mintFeePercentage],
  );

  const onSubmit: IAmountFormProps['onSubmit'] = async amountTokens => {
    const formattedAmountTokens = new BigNumber(amountTokens);

    const amountWei = convertCoinsToWei({
      value: formattedAmountTokens,
      tokenId: VAI_ID,
    });

    try {
      // Send request to repay VAI
      await mintVai(amountWei);

      // @TODO: display success modal instead of toast once it's been
      // implemented
      const readableAmountTokens = formatCoinsToReadableValue({
        value: formattedAmountTokens,
        tokenId: VAI_ID,
      });

      toast.success({
        title: t('mintRepayVai.mintVai.successMessage', { tokens: readableAmountTokens }),
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
              disabled={disabled || isMintVaiLoading || !hasMintableVai}
              rightMaxButtonLabel={t('mintRepayVai.mintVai.rightMaxButtonLabel')}
            />

            <LabeledInlineContent
              css={styles.getRow({ isLast: false })}
              iconName={VAI_ID}
              label={t('mintRepayVai.mintVai.vaiLimitLabel')}
            >
              {readableVaiLimit}
            </LabeledInlineContent>

            <LabeledInlineContent
              css={styles.getRow({ isLast: true })}
              iconName="fee"
              label={t('mintRepayVai.mintVai.mintFeeLabel')}
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
            {t('mintRepayVai.mintVai.btnMintVai')}
          </SecondaryButton>
        </>
      )}
    </AmountForm>
  );
};

const MintVai: React.FC = () => {
  const { account } = React.useContext(AuthContext);
  const { mintableVai } = useVaiUser();
  const { t } = useTranslation();

  const { data: vaiTreasuryPercentage, isLoading: isGetVaiTreasuryPercentageLoading } =
    useGetVaiTreasuryPercentage();

  const { mutate: contractMintVai, isLoading: isMintVaiLoading } = useMintVai();

  // Convert limit into wei of VAI
  const limitWei = React.useMemo(
    () => convertCoinsToWei({ value: mintableVai, tokenId: VAI_ID }),
    [mintableVai.toString()],
  );

  const mintVai: IMintVaiUiProps['mintVai'] = async amountWei => {
    if (!account) {
      const errorMessage = t('mintRepayVai.mintVai.undefinedAccountErrorMessage');
      // This error should never happen, since the form inside the UI component
      // is disabled if there's no logged in account
      throw internalError(errorMessage);
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
