import { cn } from '@venusprotocol/ui';
import BigNumber from 'bignumber.js';

import {
  LabeledInlineContent,
  type LabeledInlineContentProps,
} from 'components/LabeledInlineContent';
import { ValueUpdate, type ValueUpdateProps } from 'components/ValueUpdate';
import { formatCentsToReadableValue } from 'utilities';

export interface LabeledValueUpdateProps
  extends Omit<LabeledInlineContentProps, 'children'>,
    Pick<ValueUpdateProps, 'original' | 'update'> {
  deltaAmountCents?: BigNumber.Value;
  className?: string;
}

export const LabeledValueUpdate: React.FC<LabeledValueUpdateProps> = ({
  className,
  deltaAmountCents,
  original,
  update,
  ...otherProps
}) => {
  let readableAmountDollars = deltaAmountCents
    ? formatCentsToReadableValue({
        value: new BigNumber(deltaAmountCents).absoluteValue(),
      })
    : undefined;

  if (readableAmountDollars && deltaAmountCents) {
    const sign = new BigNumber(deltaAmountCents).isLessThan(0) ? '-' : '+';
    readableAmountDollars = `${sign} ${readableAmountDollars}`;
  }

  return (
    <div className={cn('flex flex-col items-end', className)}>
      <LabeledInlineContent {...otherProps}>
        <ValueUpdate original={original} update={update} />
      </LabeledInlineContent>

      {readableAmountDollars && <p className="text-grey text-sm">{readableAmountDollars}</p>}
    </div>
  );
};
