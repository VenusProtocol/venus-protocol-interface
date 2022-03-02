type EventParameters = Parameters<(eventName: string, parameters?: Record<string, string>) => void>;

export type ButtonEventMap = {
  connect: Record<string, string>;
};

export type ButtonEventName = keyof ButtonEventMap;

const googleAnalytics = () => {
  let gtag: Gtag.Gtag;
  const loadGTag = (callback: (...args: EventParameters) => void) => (...args: EventParameters) => {
    gtag = window?.gtag;
    if (!gtag && process.env.NODE_ENV !== 'production') {
      console.warn('gtag not loaded. Google Analytics event not sent', args);
    } else {
      callback(...args);
    }
  };

  const sendEvent = loadGTag((eventName: string, parameters?: Record<string, string>) => {
    gtag('event', eventName, parameters);
  });

  function buttonPressed<E extends ButtonEventName>(
    buttonName: E,
    parameters?: ButtonEventMap[E] extends undefined ? never : ButtonEventMap[E],
  ): void {
    sendEvent('button_pressed', { button_name: buttonName, ...parameters });
  }

  return {
    buttonPressed,
  };
};

export default googleAnalytics();
