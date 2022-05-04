import React from 'react';
import { useField } from 'formik';

import { LabeledInlineContent } from 'components';
import { useTranslation } from 'translation';
import { useStyles } from '../styles';

const MintFee = ({ getReadableMintFee }: { getReadableMintFee: (value: string) => string }) => {
  const [{ value }] = useField('amount');
  const styles = useStyles();
  const { t } = useTranslation();
  return (
    <LabeledInlineContent
      css={styles.getRow({ isLast: true })}
      iconName="fee"
      label={t('mintRepayVai.mintVai.mintFeeLabel')}
    >
      {getReadableMintFee(value)}
    </LabeledInlineContent>
  );
};

export default MintFee;
