import BigNumber from 'bignumber.js';

import { LabeledInlineContent, TokenTextField, TokenTextFieldProps } from 'components';
import useFormatTokensToReadableValue from 'hooks/useFormatTokensToReadableValue';

export interface TextFieldsProps extends Pick<TokenTextFieldProps, 'token' | 'disabled'> {
  label: string;
  infosLabel?: string;
  infosTooltip?: string;
  infosAmountTokens?: BigNumber;
}

export const TextField: React.FC<TextFieldsProps> = ({
  token,
  disabled,
  label,
  infosLabel,
  infosTooltip,
  infosAmountTokens,
}) => {
  const readableValue = useFormatTokensToReadableValue({
    token,
    value: infosAmountTokens,
  });

  return (
    <div>
      <LabeledInlineContent label={label} className="grid grid-cols-[1fr_150px] gap-4 space-x-0">
        <TokenTextField
          name="stakedAmountTokens"
          token={token}
          // TODO: wire up
          value=""
          onChange={() => {}}
          disabled={disabled}
          displayTokenIcon={false}
          className="w-full"
        />
      </LabeledInlineContent>

      {infosLabel && infosAmountTokens && (
        <LabeledInlineContent
          label={infosLabel}
          className="grid h-[58px] grid-cols-[1fr_150px] gap-4 space-x-0"
          tooltip={infosTooltip}
        >
          <div className="pl-4 font-semibold">{readableValue}</div>
        </LabeledInlineContent>
      )}
    </div>
  );
};
