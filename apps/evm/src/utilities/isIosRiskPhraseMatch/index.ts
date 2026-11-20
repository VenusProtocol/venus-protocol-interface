import { IOS_RISK_CONFIRM_PHRASE } from 'constants/iosRisk';

export const isIosRiskPhraseMatch = (value: string) =>
  value.trim().replace(/\s+/g, ' ').replace(/\.$/, '').toLowerCase() ===
  IOS_RISK_CONFIRM_PHRASE.toLowerCase();
