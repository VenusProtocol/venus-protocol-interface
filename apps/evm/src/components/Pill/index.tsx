import { cn } from 'utilities';

export type PillProps = React.HTMLAttributes<HTMLDivElement>;

export const Pill: React.FC<PillProps> = ({ className, children, ...otherProps }) => (
  <div
    className={cn(
      'border-yellow text-yellow flex flex-row rounded-full border bg-[#2E2C2A] px-3 py-1 text-xs font-semibold uppercase lining-nums proportional-nums leading-[15px] tracking-[0.5px] [font-variant:all-small-caps]',
      className,
    )}
    {...otherProps}
  >
    {children}
  </div>
);
