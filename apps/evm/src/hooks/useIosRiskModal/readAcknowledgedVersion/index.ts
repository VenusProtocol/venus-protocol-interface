import { IOS_RISK_ACK_STORAGE_KEY } from 'constants/iosRisk';

export const readAcknowledgedVersion = () => {
  try {
    return window.sessionStorage.getItem(IOS_RISK_ACK_STORAGE_KEY) ?? undefined;
  } catch {
    return undefined;
  }
};
