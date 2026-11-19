import { useLayoutEffect, useRef } from 'react';

import { fitMenuToViewport } from '../fitMenuToViewport';

export interface FittedMenuProps {
  className: string;
  children: React.ReactNode;
}

// Keeps the menu fitted to the viewport while it is open, including when the window resizes.
export const FittedMenu: React.FC<FittedMenuProps> = ({ className, children }) => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const fit = () => fitMenuToViewport(ref.current ?? undefined);

    fit();
    window.addEventListener('resize', fit);

    return () => window.removeEventListener('resize', fit);
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};
