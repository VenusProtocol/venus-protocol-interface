/** @jsxImportSource @emotion/react */
import { FieldArray } from 'formik';

import { FormikTextField } from 'containers/Form';
import { parseFunctionSignature } from 'utilities';
import { ErrorCode } from '../proposalSchema';
import { useStyles } from './styles';

interface CallDataFieldsProps {
  signature: string;
  actionIndex: number;
}

const CallDataFields: React.FC<CallDataFieldsProps> = ({ signature, actionIndex }) => {
  const styles = useStyles();
  const abiItems = parseFunctionSignature(signature)?.inputs || [];

  return (
    <FieldArray
      name="data"
      render={() =>
        abiItems.map((param, idx) => {
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
