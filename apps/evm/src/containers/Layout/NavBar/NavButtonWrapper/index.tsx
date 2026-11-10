import { ButtonWrapper, type ButtonWrapperProps, cn } from '@venusprotocol/ui';

export interface NavButtonWrapperProps extends ButtonWrapperProps {}

export const NavButtonWrapper: React.FC<NavButtonWrapperProps> = ({ className, ...otherProps }) => (
  <ButtonWrapper
    variant="secondary"
    className={cn('text-p3r h-9 px-3 py-0 shadow-none hover:no-underline', className)}
    {...otherProps}
  />
);
