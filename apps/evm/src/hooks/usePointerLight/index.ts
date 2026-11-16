import { useEffect } from 'react';

const CONTROL_SELECTOR = '[data-pointer-light]:not(:disabled):not([aria-disabled="true"])';

export const usePointerLight = () => {
  useEffect(() => {
    const trackPointer = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) {
        return;
      }

      const control = event.target.closest<HTMLElement>(CONTROL_SELECTOR);

      if (!control) {
        return;
      }

      const { left, top } = control.getBoundingClientRect();
      control.style.setProperty('--pointer-x', `${event.clientX - left}px`);
      control.style.setProperty('--pointer-y', `${event.clientY - top}px`);
    };

    document.addEventListener('pointermove', trackPointer, { passive: true });
    document.addEventListener('pointerdown', trackPointer, { passive: true });

    return () => {
      document.removeEventListener('pointermove', trackPointer);
      document.removeEventListener('pointerdown', trackPointer);
    };
  }, []);
};
