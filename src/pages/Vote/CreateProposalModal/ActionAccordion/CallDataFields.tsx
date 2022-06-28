/** @jsxImportSource @emotion/react */
import React from 'react';
import { FieldArray } from 'formik';
import { ethers } from 'ethers';
import type { FunctionFragment } from '@ethersproject/abi';
import { FormikTextField } from 'components';
import { ErrorCode } from '../proposalSchema';
import { useStyles } from './styles';

interface ICallDataFieldsProps {
  signature: string;
  actionIndex: number;
}

const parseSignature = (func: string) => {
  let funcInputs: FunctionFragment['inputs'] = [];
  try {
    const fragment = ethers.utils.FunctionFragment.from(func);
    funcInputs = fragment.inputs;
  } catch (err) {
    // eslint-disable-next-line no-console
  }
  return funcInputs;
};

const CallDataFields: React.FC<ICallDataFieldsProps> = ({ signature, actionIndex }) => {
  const styles = useStyles();
  const callDataTypes = parseSignature(signature || '');

  return (
    <FieldArray
      name="callData"
      render={() =>
        callDataTypes.map((param, idx) => {
          const name = `actions.${actionIndex}.callData.${idx}`;
          return (
            <FormikTextField
              key={name}
              name={name}
              data-testid={name}
              css={[styles.formBottomMargin, styles.addTopMargin(idx === 0)]}
              placeholder={param.type}
              displayableErrorCodes={[
                ErrorCode.VALUE_REQUIRED,
                ErrorCode.CALL_DATA_ARGUMENT_INVALID,
              ]}
            />
          );
        })
      }
    />
  );
};

export default CallDataFields;
