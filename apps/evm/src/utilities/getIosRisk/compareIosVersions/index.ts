import type { IosVersionParts } from 'types';

export const compareIosVersions = (a: IosVersionParts, b: IosVersionParts) => {
  const differentIndex = a.findIndex((part, index) => part !== b[index]);

  if (differentIndex === -1) {
    return 0;
  }

  return a[differentIndex] < b[differentIndex] ? -1 : 1;
};
