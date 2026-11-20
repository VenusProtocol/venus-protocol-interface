import type { IosVersionParts } from 'types';

export const parseIosVersion = ({ version, separator }: { version: string; separator: string }) => {
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
