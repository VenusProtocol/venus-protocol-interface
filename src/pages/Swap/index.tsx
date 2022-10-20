/** @jsxImportSource @emotion/react */
// import BigNumber from 'bignumber.js';
import Paper from '@mui/material/Paper';
import { SelectTokenTextField } from 'components';
import { Formik } from 'formik';
import React from 'react';
import { TokenId } from 'types';

import { TOKENS } from 'constants/tokens';

import { useStyles } from './styles';
import getValidationSchema, { FormValues } from './validationSchema';

const tokenIds = Object.keys(TOKENS) as TokenId[];

const initialFormValues: FormValues = {
  fromTokenId: 'bnb',
  fromTokenAmount: '',
  toTokenId: 'xvs',
  toTokenAmount: '',
  direction: 'exactAmountIn',
};

const SwapUi: React.FC = () => {
  const styles = useStyles();

  const handleSubmit = async (values: FormValues) => {
    // TODO: handle submission
    console.log(values);
  };

  return (
    <Paper css={styles.container}>
      <Formik
        initialValues={initialFormValues}
        onSubmit={handleSubmit}
        validationSchema={getValidationSchema({
          // TODO: fetch user token balance
          fromTokenMaxAmount: '10000000',
        })}
        isInitialValid={false}
        validateOnMount
        validateOnChange
      >
        {({ values, setFieldValue }) => (
          <>
            <SelectTokenTextField
              name="fromTokenAmount"
              selectedTokenId={values.fromTokenId as TokenId}
              value={values.fromTokenAmount}
              onChange={amount => {
                setFieldValue('fromTokenAmount', amount);
                // Update swap direction
                setFieldValue('direction', 'exactAmountIn');
              }}
              onChangeSelectedTokenId={tokenId => {
                // Invert fromTokenId and toTokenId if selected token ID is equal
                // to toTokenId
                if (tokenId === values.toTokenId) {
                  setFieldValue('toTokenId', values.fromTokenId);
                }

                setFieldValue('fromTokenId', tokenId);
              }}
              tokenIds={tokenIds.filter(tokenId => tokenId !== values.fromTokenId)}
            />

            <SelectTokenTextField
              name="toTokenAmount"
              selectedTokenId={values.toTokenId as TokenId}
              value={values.toTokenAmount}
              onChange={amount => {
                setFieldValue('toTokenAmount', amount);
                // Update swap direction
                setFieldValue('direction', 'exactAmountOut');
              }}
              onChangeSelectedTokenId={tokenId => {
                // Invert fromTokenId and toTokenId if selected token ID is equal
                // to fromTokenId
                if (tokenId === values.fromTokenId) {
                  setFieldValue('fromTokenId', values.toTokenId);
                }

                setFieldValue('toTokenId', tokenId);
              }}
              tokenIds={tokenIds.filter(tokenId => tokenId !== values.toTokenId)}
            />
          </>
        )}
      </Formik>
    </Paper>
  );
};

import { useStyles } from './styles';
import { Swap, SwapDirection } from './types';
import useGetSwapInfo from './useGetSwapInfo';

const tokens = Object.values(PANCAKE_SWAP_TOKENS) as Token[];

const readableSlippageTolerancePercentage = formatToReadablePercentage(
  SLIPPAGE_TOLERANCE_PERCENTAGE,
);

interface FormValues {
  fromToken: Token;
  fromTokenAmountTokens: string;
  toToken: Token;
  toTokenAmountTokens: string;
  direction: SwapDirection;
}

const initialFormValues: FormValues = {
  // TODO: handle mainnet
  fromToken: TESTNET_PANCAKE_SWAP_TOKENS.busd as Token,
  fromTokenAmountTokens: '',
  // TODO: handle mainnet
  toToken: TESTNET_PANCAKE_SWAP_TOKENS.cake as Token,
  toTokenAmountTokens: '',
  direction: 'exactAmountIn',
};

export interface SwapPageUiProps {
  formValues: FormValues;
  setFormValues: (setter: (currentFormValues: FormValues) => FormValues) => void;
  fromTokenUserBalanceWei?: BigNumber;
  toTokenUserBalanceWei?: BigNumber;
  swapInfo?: Swap;
}

const SwapPageUi: React.FC<SwapPageUiProps> = ({
  formValues,
  setFormValues,
  swapInfo,
  fromTokenUserBalanceWei,
  toTokenUserBalanceWei,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  // TODO: reinitialize form values if swap becomes invalid
  // if (!swapInfo) {
  //   setFormValues(currentFormValues => ({
  //     ...currentFormValues,
  //     fromTokenAmountTokens: '',
  //     toTokenAmountTokens: '',
  //   }));
  // }

  useEffect(() => {
    if (swapInfo?.direction === 'exactAmountIn') {
      setFormValues(currentFormValues => ({
        ...currentFormValues,
        toTokenAmountTokens: convertWeiToTokens({
          valueWei: swapInfo.expectedToTokenAmountReceivedWei,
          token: swapInfo.toToken,
        }).toFixed(),
      }));
    }

    if (swapInfo?.direction === 'exactAmountOut') {
      setFormValues(currentFormValues => ({
        ...currentFormValues,
        fromTokenAmountTokens: convertWeiToTokens({
          valueWei: swapInfo.expectedFromTokenAmountSoldWei,
          token: swapInfo.fromToken,
        }).toFixed(),
      }));
    }
  }, [swapInfo]);

  const switchTokens = () =>
    setFormValues(currentFormValues => ({
      ...currentFormValues,
      fromToken: currentFormValues.toToken,
      fromTokenAmountTokens:
        currentFormValues.direction === 'exactAmountIn'
          ? ''
          : currentFormValues.toTokenAmountTokens,
      toToken: currentFormValues.fromToken,
      toTokenAmountTokens:
        currentFormValues.direction === 'exactAmountIn'
          ? currentFormValues.fromTokenAmountTokens
          : '',
      direction:
        currentFormValues.direction === 'exactAmountIn' ? 'exactAmountOut' : 'exactAmountIn',
    }));

  return (
    <Paper css={styles.container}>
      <SelectTokenTextField
        label={t('swapPage.fromTokenAmountField.label')}
        selectedToken={formValues.fromToken}
        value={formValues.fromTokenAmountTokens}
        onChange={amount =>
          setFormValues(currentFormValues => ({
            ...currentFormValues,
            fromTokenAmountTokens: amount,
            direction: 'exactAmountIn',
          }))
        }
        onChangeSelectedToken={token =>
          setFormValues(currentFormValues => ({
            ...currentFormValues,
            fromToken: token,
            // Invert toToken and fromToken if selected token is the same as
            // toToken
            toToken:
              token.address === formValues.toToken.address
                ? currentFormValues.fromToken
                : currentFormValues.toToken,
          }))
        }
        tokens={tokens.filter(token => token.address !== formValues.fromToken.address)}
        userTokenBalanceWei={fromTokenUserBalanceWei}
        css={styles.selectTokenTextField}
      />

      <TertiaryButton css={styles.switchButton} onClick={switchTokens}>
        <Icon name="convert" css={styles.switchButtonIcon} />
      </TertiaryButton>

      <SelectTokenTextField
        label={t('swapPage.toTokenAmountField.label')}
        selectedToken={formValues.toToken}
        value={formValues.toTokenAmountTokens}
        onChange={amount =>
          setFormValues(currentFormValues => ({
            ...currentFormValues,
            toTokenAmountTokens: amount,
            direction: 'exactAmountOut',
          }))
        }
        onChangeSelectedToken={token =>
          setFormValues(currentFormValues => ({
            ...currentFormValues,
            toToken: token,
            // Invert fromToken and toToken if selected token is the same as
            // fromToken
            fromToken:
              token.address === formValues.fromToken.address
                ? currentFormValues.toToken
                : currentFormValues.fromToken,
          }))
        }
        tokens={tokens.filter(token => token.address !== formValues.toToken.address)}
        userTokenBalanceWei={toTokenUserBalanceWei}
        css={styles.selectTokenTextField}
      />

      {swapInfo && (
        <>
          <LabeledInlineContent label={t('swapPage.exchangeRate.label')} css={styles.swapInfoRow}>
            {t('swapPage.exchangeRate.value', {
              fromTokenSymbol: formValues.fromToken.symbol,
              toTokenSymbol: formValues.toToken.symbol,
              rate: swapInfo.exchangeRate,
            })}
          </LabeledInlineContent>

          <LabeledInlineContent
            label={t('swapPage.slippageTolerance.label')}
            css={styles.swapInfoRow}
          >
            {readableSlippageTolerancePercentage}
          </LabeledInlineContent>

          <LabeledInlineContent
            label={
              swapInfo.direction === 'exactAmountIn'
                ? t('swapPage.minimumReceived.label')
                : t('swapPage.maximumSold.label')
            }
            css={styles.swapInfoRow}
          >
            {convertWeiToTokens({
              valueWei:
                swapInfo.direction === 'exactAmountIn'
                  ? swapInfo.minimumToTokenAmountReceivedWei
                  : swapInfo.maximumFromTokenAmountSoldWei,
              token: swapInfo.direction === 'exactAmountIn' ? swapInfo.toToken : swapInfo.fromToken,
              returnInReadableFormat: true,
            })}
          </LabeledInlineContent>
        </>
      )}

      <PrimaryButton fullWidth disabled={!swapInfo} css={styles.submitButton}>
        {swapInfo
          ? t('swapPage.submitButton.enabledLabel', {
              fromTokenAmount: convertWeiToTokens({
                valueWei:
                  swapInfo.direction === 'exactAmountIn'
                    ? swapInfo.fromTokenAmountSoldWei
                    : swapInfo.maximumFromTokenAmountSoldWei,
                token: swapInfo.fromToken,
                returnInReadableFormat: true,
              }),
              toTokenAmount: convertWeiToTokens({
                valueWei:
                  swapInfo.direction === 'exactAmountIn'
                    ? swapInfo.minimumToTokenAmountReceivedWei
                    : swapInfo.toTokenAmountReceivedWei,
                token: swapInfo.toToken,
                returnInReadableFormat: true,
              }),
            })
          : t('swapPage.submitButton.disabledLabel')}
      </PrimaryButton>
    </Paper>
  );
};

const SwapPage: React.FC = () => {
  const { account } = React.useContext(AuthContext);

  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);

  const swapInfo = useGetSwapInfo({
    fromToken: formValues.fromToken,
    fromTokenAmountTokens: formValues.fromTokenAmountTokens,
    toToken: formValues.toToken,
    toTokenAmountTokens: formValues.toTokenAmountTokens,
    direction: formValues.direction,
  });

  const { data: fromTokenUserBalanceData } = useGetBalanceOf(
    { accountAddress: account?.address || '', tokenId: formValues.fromToken.id },
    {
      enabled: !!account?.address,
    },
  );

  const { data: toTokenUserBalanceData } = useGetBalanceOf(
    { accountAddress: account?.address || '', tokenId: formValues.toToken.id },
    {
      enabled: !!account?.address,
    },
  );

  return (
    <SwapPageUi
      formValues={formValues}
      setFormValues={setFormValues}
      swapInfo={swapInfo}
      fromTokenUserBalanceWei={fromTokenUserBalanceData?.balanceWei}
      toTokenUserBalanceWei={toTokenUserBalanceData?.balanceWei}
    />
  );
};

export default SwapPage;
