export type IosExploitKit = 'Coruna' | 'DarkSword';

type IosVersionParts = [number, number, number];

interface IosAffectedRange {
  kit: IosExploitKit;
  from: IosVersionParts;
  to: IosVersionParts;
  fromLabel: string;
  toLabel: string;
}

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

const FIRST_UNAFFECTED_SAFARI_MAJOR_VERSION = 26;

export type IosRisk =
  | {
      status: 'affected';
      kit: IosExploitKit;
      version: string;
      from: string;
      to: string;
    }
  | { status: 'unreadable' };

export interface GetIosRiskInput {
  userAgent: string;
  maxTouchPoints: number;
  supportsWebKit26: boolean;
}

const compareVersions = (a: IosVersionParts, b: IosVersionParts) => {
  for (let index = 0; index < a.length; index++) {
    if (a[index] !== b[index]) {
      return a[index] < b[index] ? -1 : 1;
    }
  }

  return 0;
};

const parseVersion = (version: string, separator: string) => {
  const [major, minor = 0, patch = 0] = version.split(separator).map(Number);
  const parts: IosVersionParts = [major, minor, patch];

  return {
    parts,
    label: parts
      .slice(0, patch > 0 ? 3 : 2)
      .map(String)
      .join('.'),
  };
};

export const getIosRisk = ({
  userAgent,
  maxTouchPoints,
  supportsWebKit26,
}: GetIosRiskInput): IosRisk | undefined => {
  const isMobileIos = /iPhone|iPad|iPod/.test(userAgent);
  const isDesktopModeIpad = /Macintosh/.test(userAgent) && maxTouchPoints > 1;

  if (!isMobileIos && !isDesktopModeIpad) {
    return undefined;
  }

  const safariVersion = userAgent.match(/Version\/(\d+(?:\.\d+){0,2})/)?.[1];

  if (
    safariVersion &&
    Number(safariVersion.split('.')[0]) >= FIRST_UNAFFECTED_SAFARI_MAJOR_VERSION
  ) {
    return undefined;
  }

  if (supportsWebKit26) {
    return undefined;
  }

  const osVersion = userAgent.match(/\bOS (\d+(?:_\d+){0,2})\b/)?.[1];

  let version: ReturnType<typeof parseVersion> | undefined;

  if (osVersion) {
    version = parseVersion(osVersion, '_');
  } else if (isDesktopModeIpad && safariVersion) {
    version = parseVersion(safariVersion, '.');
  }

  if (!version) {
    return { status: 'unreadable' };
  }

  const { parts, label } = version;

  const range = IOS_AFFECTED_RANGES.find(
    ({ from, to }) => compareVersions(parts, from) >= 0 && compareVersions(parts, to) <= 0,
  );

  if (!range) {
    return undefined;
  }

  return {
    status: 'affected',
    kit: range.kit,
    version: label,
    from: range.fromLabel,
    to: range.toLabel,
  };
};

export const getIosBrowserName = (userAgent: string) => {
  if (/CriOS\//.test(userAgent)) {
    return 'Chrome';
  }

  if (/FxiOS\//.test(userAgent)) {
    return 'Firefox';
  }

  if (/EdgiOS\//.test(userAgent)) {
    return 'Edge';
  }

  if (/Version\/[\d.]+.*Safari\//.test(userAgent)) {
    return 'Safari';
  }

  return 'In-app browser';
};

export const IOS_RISK_CONFIRM_PHRASE = 'I understand the risks';

const normalizePhrase = (value: string) =>
  value.trim().replace(/\s+/g, ' ').replace(/\.$/, '').toLowerCase();

export const isIosRiskPhraseMatch = (value: string) =>
  normalizePhrase(value) === normalizePhrase(IOS_RISK_CONFIRM_PHRASE);
