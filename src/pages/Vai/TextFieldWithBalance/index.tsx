/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { FormikTokenTextField } from 'components';
import { useField } from 'formik';
import React from 'react';
import { useTranslation } from 'translation';
import { convertWeiToTokens } from 'utilities';

import { TOKENS } from 'constants/tokens';

import { useStyles } from '../styles';
import TEST_IDS from '../testIds';

export interface IFormikTokenTextFieldWithBalanceProps {
  disabled: boolean;
  maxValue: string;
  maxButtonLabel: string;
  userBalanceWei: BigNumber | undefined;
}

const FIELD_NAME = 'amount';

export const FormikTokenTextFieldWithBalance: React.FC<IFormikTokenTextFieldWithBalanceProps> = ({
  disabled,
  maxValue,
  maxButtonLabel,
  userBalanceWei,
}) => {
  const styles = useStyles();
  const { Trans } = useTranslation();

  // eslint-disable-next-line  @typescript-eslint/naming-convention
  const [_inputProps, _metaProps, { setValue }] = useField('amount');

  return (
    <>
      <FormikTokenTextField
        name={FIELD_NAME}
        css={styles.textField}
        token={TOKENS.vai}
        max={maxValue}
        disabled={disabled}
        rightMaxButton={{
          label: maxButtonLabel,
          onClick: () => setValue(maxValue),
        }}
        data-testid={TEST_IDS.repayTextField}
        description={
          <div css={styles.greyLabel}>
            <Trans
              i18nKey="operationModal.repay.walletBalance"
              components={{
                White: <span css={styles.whiteLabel} />,
              }}
              values={{
                balance: convertWeiToTokens({
                  valueWei: userBalanceWei || new BigNumber(0),
                  token: TOKENS.vai,
                  returnInReadableFormat: true,
                  addSymbol: true,
                }),
              }}
            />
          </div>
        }
      />
    </>
  );
};

export default FormikTokenTextFieldWithBalance;
