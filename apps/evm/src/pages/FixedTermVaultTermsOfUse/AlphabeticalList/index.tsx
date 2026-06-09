import { cn } from '@venusprotocol/ui';

export type AlphabeticalListProps = React.OlHTMLAttributes<HTMLOListElement>;

export const AlphabeticalList: React.FC<AlphabeticalListProps> = ({
  children,
  className,
  ...otherProps
}) => (
  <ol
    type="a"
    className={cn(
      'm-0 mt-5 list-none ps-0',
      '[&>li]:relative [&>li]:ps-6',
      '[&>li]:before:absolute [&>li]:before:start-0',
      '[&>li]:before:text-white',
      '[&>li]:before:content-["("counter(list-item,lower-alpha)")"]',
      className,
    )}
    {...otherProps}
  >
    {children}
  </ol>
);
