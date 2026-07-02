import { createPortal } from 'react-dom';

import { cn } from '@venusprotocol/ui';
import { BODY_PORTAL_ID } from 'constants/layout';

export interface BodyBackdropProps extends React.HTMLAttributes<HTMLDivElement> {}

export const BodyBackdrop: React.FC<BodyBackdropProps> = ({ className, ...otherProps }) => {
  const backdropPortalDom =
    typeof document === 'undefined'
      ? undefined
      : document.getElementById(BODY_PORTAL_ID) || document.body;

  if (!backdropPortalDom) {
    return undefined;
  }

  return createPortal(
    <div className={cn('fixed inset-0 backdrop-blur-xs z-9999', className)} {...otherProps} />,
    backdropPortalDom,
  );
};
