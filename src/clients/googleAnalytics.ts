type EventParameters = Parameters<(eventName: string, parameters?: Record<string, string>) => void>;

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

  const buttonPressed = (buttonName: string, parameters: Record<string, string> = {}) => {
    sendEvent('button_pressed', { button_name: buttonName, ...parameters });
  };

  return {
    buttonPressed,
  };
};

export default googleAnalytics();
