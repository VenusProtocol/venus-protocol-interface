import BigNumber from 'bignumber.js';
import { forwardRef } from 'react';

import { LabeledInlineContent, TokenTextField, TokenTextFieldProps } from 'components';
import useFormatTokensToReadableValue from 'hooks/useFormatTokensToReadableValue';

export interface FieldsProps extends TokenTextFieldProps {
  label: string;
  infosLabel?: string;
  infosTooltip?: string;
  infosAmountTokens?: BigNumber;
  errorLabel?: string;
}

export const Field: React.FC<FieldsProps> = forwardRef<HTMLInputElement, FieldsProps>(
  (
    {
      token,
      label,
      infosLabel,
      infosTooltip,
      infosAmountTokens,
      errorLabel,
      ...tokenTextFieldProps
    },
    ref,
  ) => {
    const readableValue = useFormatTokensToReadableValue({
      token,
      value: infosAmountTokens,
    });

    return (
      <div>
        <LabeledInlineContent label={label} className="grid grid-cols-[1fr_150px] gap-4 space-x-0">
          <TokenTextField
            token={token}
            displayTokenIcon={false}
            className="w-full"
            ref={ref}
            {...tokenTextFieldProps}
          />
        </LabeledInlineContent>

        {infosLabel && (
          <LabeledInlineContent
            label={infosLabel}
            className="grid h-[58px] grid-cols-[1fr_150px] gap-4 space-x-0"
            tooltip={infosTooltip}
          >
            <div className="pl-4 font-semibold">{readableValue}</div>
          </LabeledInlineContent>
        )}

        {errorLabel && <p className="text-grey mt-4 text-sm md:text-base">{errorLabel}</p>}
      </div>
    );
  },
);
