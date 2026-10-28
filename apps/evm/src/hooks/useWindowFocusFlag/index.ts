import { useEffect } from 'react';

const FOCUSED_CLASS_NAME = 'venus-window-focused';

/** Lets CSS pause decorative animations while the window sits in the background. */
export const useWindowFocusFlag = () => {
  useEffect(() => {
    const sync = () => {
      document.body.classList.toggle(FOCUSED_CLASS_NAME, document.hasFocus() && !document.hidden);
    };

    sync();
    window.addEventListener('focus', sync);
    window.addEventListener('blur', sync);
    document.addEventListener('visibilitychange', sync);

    return () => {
      window.removeEventListener('focus', sync);
      window.removeEventListener('blur', sync);
      document.removeEventListener('visibilitychange', sync);
      document.body.classList.remove(FOCUSED_CLASS_NAME);
    };
  }, []);
};
