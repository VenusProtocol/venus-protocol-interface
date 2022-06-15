/** @jsxImportSource @emotion/react */
import React from 'react';
import { FieldArray } from 'formik';
import { FormikTextField } from 'components';
import { ErrorCode } from '../proposalSchema';
import { useStyles } from './styles';

interface ICallDataFieldsProps {
  signature: string;
  actionIndex: number;
}

const parseSignature = (func: string) => {
  // First match everything inside the function argument parens.
  const args = func.match(/.*?\(([^)]*)\)/) || [func, ''];
  // Split the arguments string into an array comma delimited.
  return args[1].split(',').reduce((acc, curr) => {
    // Ensure no inline comments are parsed and trim the whitespace.
    curr.replace(/\/\*.*\*\//, '').trim();
    if (curr) {
      acc.push(curr);
      return acc;
    }
    return acc;
  }, [] as string[]);
};

const CallDataFields: React.FC<ICallDataFieldsProps> = ({ signature, actionIndex }) => {
  const styles = useStyles();
  const callDataTypes: string[] = parseSignature(signature || '');

  return (
    <FieldArray
      name="callData"
      render={() =>
        callDataTypes.map((type, idx) => (
          <>
            <FormikTextField
              name={`actions.${actionIndex}.callData.${idx}`}
              css={[styles.formBottomMargin, styles.addTopMargin(idx === 0)]}
              placeholder={type}
              displayableErrorCodes={[ErrorCode.VALUE_REQUIRED]}
            />
          </>
        ))
      }
    />
  );
};

export default CallDataFields;
