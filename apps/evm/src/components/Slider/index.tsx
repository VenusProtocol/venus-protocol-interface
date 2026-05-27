import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@venusprotocol/ui';
import { useState } from 'react';
import { TickMark } from './TickMark';

const tickMarks = [25, 50, 75];

export interface SliderProps {
  value: number;
  onChange: (newValue: number) => void;
  step: number;
  max: number;
  min?: number;
  disabled?: boolean;
  className?: string;
  rangeClassName?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max,
  step,
  disabled = false,
  className,
  rangeClassName,
}) => {
  const [isValueIndicatorVisible, setIsValueIndicatorVisible] = useState(false);

  const showValueIndicator = () => setIsValueIndicatorVisible(true);
  const hideValueIndicator = () => setIsValueIndicatorVisible(false);

  const valuePercentage = Math.round(((value - min) * 100) / (max - min));

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={[min, max]}
      value={[value]}
      min={min}
      max={max}
      step={step}
      onValueChange={([newValue]) => onChange(newValue)}
      className={cn(
        'relative flex w-full touch-none items-center select-none',
        !disabled && 'cursor-pointer',
        className,
      )}
      disabled={disabled}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="bg-dark-blue-hover relative grow overflow-hidden rounded-full h-2 w-full"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn('bg-blue absolute h-full', rangeClassName)}
        />
      </SliderPrimitive.Track>

      {tickMarks.map(tickMark => (
        <TickMark
          key={tickMark}
          style={{
            left: `${tickMark}%`,
            marginLeft: `${4 - tickMark / 5}px`,
          }}
          isActive={valuePercentage >= tickMark}
        />
      ))}

      <SliderPrimitive.Thumb
        data-slot="slider-thumb"
        className={cn(
          'block relative size-5 shrink-0 outline-hidden rounded-full border-white border-4 bg-blue shadow-sm',
        )}
        onMouseEnter={showValueIndicator}
        onMouseLeave={hideValueIndicator}
      >
        {isValueIndicatorVisible && (
          <div className="absolute left-[50%] translate-x-[-50%] bottom-5 px-1 py-0.5 bg-dark-blue-hover rounded-md text-center text-xs">
            {valuePercentage}%
          </div>
        )}
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
  );
};
