import { cn } from '@venusprotocol/ui';

export type PillProps = React.HTMLAttributes<HTMLDivElement>;

export const Pill: React.FC<PillProps> = ({ className, children, ...otherProps }) => (
  <div
    className={cn(
      'border-yellow text-yellow inline-flex flex-row rounded-full border px-3 py-1 text-xs font-semibold uppercase lining-nums proportional-nums leading-[15px] tracking-[0.5px] [font-variant:all-small-caps]',
      className,
    )}
    {...otherProps}
  >
    {children}
  </div>
);
