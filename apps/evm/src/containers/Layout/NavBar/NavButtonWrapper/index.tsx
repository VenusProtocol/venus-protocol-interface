import { ButtonWrapper, type ButtonWrapperProps, cn } from '@venusprotocol/ui';

export interface NavButtonWrapperProps extends ButtonWrapperProps {}

export const NavButtonWrapper: React.FC<NavButtonWrapperProps> = ({ className, ...otherProps }) => (
  <ButtonWrapper
    className={cn(
      'bg-dark-blue h-9 px-3 py-0 font-normal border-dark-blue-disabled/50 text-white hover:bg-dark-blue-hover hover:no-underline active:bg-dark-blue-hover',
      className,
    )}
    {...otherProps}
  />
);
