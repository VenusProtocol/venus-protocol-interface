import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@venusprotocol/ui';

export interface SliderProps {
  value: number;
  onChange: (newValue: number) => void;
  step: number;
  max: number;
  min?: number;
  disabled?: boolean;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max,
  step,
  disabled = false,
  className,
}) => (
  <SliderPrimitive.Root
    data-slot="slider"
    defaultValue={[min, max]}
    value={[value]}
    min={min}
    max={max}
    step={step}
    onValueChange={([newValue]) => onChange(newValue)}
    className={cn('relative flex w-full touch-none items-center select-none', className)}
    disabled={disabled}
  >
    <SliderPrimitive.Track
      data-slot="slider-track"
      className="bg-lightGrey relative grow overflow-hidden rounded-full h-2 w-full"
    >
      <SliderPrimitive.Range data-slot="slider-range" className="bg-blue absolute h-full" />
    </SliderPrimitive.Track>

    <SliderPrimitive.Thumb
      data-slot="slider-thumb"
      className={cn(
        'block size-5 shrink-0 outline-none rounded-full border-offWhite border-4 bg-blue shadow-sm transition-[color,box-shadow]',
        !disabled && 'cursor-pointer',
      )}
    />
  </SliderPrimitive.Root>
);
