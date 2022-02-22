type EventParameters = Parameters<(eventName: string, parameters?: Record<string, string>) => void>;

const googleAnalytics = () => {
  let gtag: Gtag.Gtag;
  const loadGTag = (callback: (...args: EventParameters) => void) => (...args: EventParameters) => {
    ({ gtag } = window);
    // This check exists because the gtag script is loaded outside of react and could potentially be missing
    // although it is typed as if it alwasy exists
    // @ts-expect-error gtag could be missing if script isn't loaded from document
    if (gtag) {
      callback(...args);
    } else if (process.env.NODE_ENV !== 'production') {
      console.warn('gtag not loaded. Google Analytics event not sent', args);
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
