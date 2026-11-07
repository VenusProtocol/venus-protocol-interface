import { ButtonWrapper, type ButtonWrapperProps, cn } from '@venusprotocol/ui';

export interface NavButtonWrapperProps extends ButtonWrapperProps {}

export const NavButtonWrapper: React.FC<NavButtonWrapperProps> = ({ className, ...otherProps }) => (
  <ButtonWrapper
    className={cn(
      'bg-surface-3 font-normal text-p3r h-9 px-3 py-0 border-control/50 text-primary hover:bg-neutral-hover hover:no-underline active:bg-neutral-hover',
      className,
    )}
    {...otherProps}
  />
);
