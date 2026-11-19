import { create } from 'zustand';

import { IOS_RISK_ACK_STORAGE_KEY } from 'constants/iosRisk';
import type { IosRisk } from 'types';

import { detectIosRisk } from './detectIosRisk';
import { readAcknowledgedVersion } from './readAcknowledgedVersion';

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
