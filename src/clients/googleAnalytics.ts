import { ConnectorNames } from 'utilities/connectors';

type EventParameters = Parameters<(eventName: string, parameters?: Record<string, string>) => void>;

export type EventMap = {
  connect_wallet: { type: ConnectorNames; code?: string };
  mint_vai: { amount: string };
  repay_vai: { amount: string };
  collateral_toggle: { status: 'enter' | 'exit' | 'in_repayment'; market: string };
};

export type EventName = keyof EventMap;

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

  function buttonPressed<E extends EventName>(
    buttonName: E,
    parameters?: EventMap[E] extends undefined ? never : EventMap[E],
  ): void {
    sendEvent('button_pressed', { button_name: buttonName, ...parameters });
  }

  function error<E extends EventName>(
    errorName: E,
    parameters?: EventMap[E] extends undefined ? never : EventMap[E],
  ): void {
    sendEvent('error', { error_name: errorName, ...parameters });
  }

  return {
    buttonPressed,
    error,
  };
};

export default googleAnalytics();
