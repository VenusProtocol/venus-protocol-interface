import { FIRST_UNAFFECTED_SAFARI_MAJOR_VERSION, IOS_AFFECTED_RANGES } from 'constants/iosRisk';
import type { IosRisk } from 'types';

import { compareIosVersions } from './compareIosVersions';
import { parseIosVersion } from './parseIosVersion';

export interface GetIosRiskInput {
  userAgent: string;
  maxTouchPoints: number;
  supportsWebKit26: boolean;
}

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
  const ipadSafariVersion = isDesktopModeIpad ? safariVersion : undefined;

  const version =
    (osVersion && parseIosVersion({ version: osVersion, separator: '_' })) ||
    (ipadSafariVersion && parseIosVersion({ version: ipadSafariVersion, separator: '.' })) ||
    undefined;

  if (!version) {
    return { status: 'unreadable' };
  }

  const range = IOS_AFFECTED_RANGES.find(
    ({ from, to }) =>
      compareIosVersions(version.parts, from) >= 0 && compareIosVersions(version.parts, to) <= 0,
  );

  if (!range) {
    return undefined;
  }

  return {
    status: 'affected',
    kit: range.kit,
    version: version.label,
    from: range.fromLabel,
    to: range.toLabel,
  };
};
