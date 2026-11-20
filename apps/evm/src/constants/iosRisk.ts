import type { IosAffectedRange } from 'types';

export const IOS_AFFECTED_RANGES: IosAffectedRange[] = [
  { kit: 'Coruna', from: [13, 0, 0], to: [17, 2, 1], fromLabel: '13.0', toLabel: '17.2.1' },
  {
    kit: 'DarkSword',
    from: [18, 4, 0],
    to: [18, 7, Number.POSITIVE_INFINITY],
    fromLabel: '18.4',
    toLabel: '18.7',
  },
];

export const FIRST_UNAFFECTED_SAFARI_MAJOR_VERSION = 26;

export const IOS_RISK_CONFIRM_PHRASE = 'I understand the risks';

export const IOS_UPDATE_GUIDE_URL = 'https://support.apple.com/118575';

export const IOS_RISK_ACK_STORAGE_KEY = 'venus-ios-risk-ack';
