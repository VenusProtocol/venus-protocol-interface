import { cn } from '@venusprotocol/ui';

import { InfoIcon, ProgressBar, type ProgressBarProps } from '..';

export interface LabeledProgressBarProps extends ProgressBarProps {
  greyLeftText?: string;
  whiteLeftText?: string | React.ReactElement;
  greyRightText?: string | React.ReactElement;
  whiteRightText?: string;
  leftInfoTooltip?: string | React.ReactNode;
  rightInfoTooltip?: string | React.ReactNode;
  className?: string;
}

export const LabeledProgressBar: React.FC<LabeledProgressBarProps> = ({
  greyRightText,
  whiteRightText,
  greyLeftText,
  whiteLeftText,
  leftInfoTooltip,
  rightInfoTooltip,
  className,
  ...progressBarProps
}) => (
  <>
    <div className={cn('mb-3 flex items-center justify-between', className)}>
      <div className="mr-6 flex">
        {greyLeftText && <span className="mr-1 text-sm text-grey">{greyLeftText}</span>}

        {whiteLeftText && <span className="text-sm font-semibold text-white">{whiteLeftText}</span>}

        {leftInfoTooltip && (
          <InfoIcon className="ml-1 inline-flex items-center" tooltip={leftInfoTooltip} />
        )}
      </div>

      <div className="flex max-md:text-right">
        {greyRightText && <span className="mr-1 text-sm text-grey">{greyRightText}</span>}

        {whiteRightText && (
          <span className="text-sm font-semibold text-white">{whiteRightText}</span>
        )}

        {rightInfoTooltip && (
          <InfoIcon className="ml-1 inline-flex items-center" tooltip={rightInfoTooltip} />
        )}
      </div>
    </div>

    <ProgressBar {...progressBarProps} />
  </>
);
