import { create } from 'zustand';

import { type IosRisk, getIosRisk } from 'utilities/getIosRisk';

export const IOS_RISK_ACK_STORAGE_KEY = 'venus-ios-risk-ack';

const detectIosRisk = (): IosRisk | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return getIosRisk({
    userAgent: window.navigator.userAgent,
    maxTouchPoints: window.navigator.maxTouchPoints ?? 0,
    supportsWebKit26: !!window.CSS?.supports?.('anchor-name', '--x'),
  });
};

const readAcknowledgedVersion = () => {
  try {
    return window.sessionStorage.getItem(IOS_RISK_ACK_STORAGE_KEY);
  } catch {
    return null;
  }
};

interface State {
  risk?: IosRisk;
  isAcknowledged: boolean;
  acknowledge: () => void;
}

const initialRisk = detectIosRisk();

export const useStore = create<State>()((set, get) => ({
  risk: initialRisk,
  isAcknowledged:
    initialRisk?.status === 'affected' && readAcknowledgedVersion() === initialRisk.version,
  acknowledge: () => {
    const { risk } = get();

    if (risk?.status === 'affected') {
      try {
        window.sessionStorage.setItem(IOS_RISK_ACK_STORAGE_KEY, risk.version);
      } catch {}
    }

    set({ isAcknowledged: true });
  },
}));
