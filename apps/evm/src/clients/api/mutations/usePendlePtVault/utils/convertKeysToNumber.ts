import { get, set } from 'lodash-es';

export const convertKeysToNumber = (
  obj: Record<string, unknown>,
  {
    bigintKeyPaths = [],
    numberKeyPaths = [],
  }: {
    bigintKeyPaths?: string[];
    numberKeyPaths?: string[];
  },
) => {
  if (!!obj && typeof obj !== 'object') return obj;

  bigintKeyPaths.forEach((keyPath: string) => {
    const value = get(obj, keyPath);
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'bigint') {
      set(obj, keyPath, BigInt(value));
    }
  });

  numberKeyPaths.forEach(keyPath => {
    const value = get(obj, keyPath);
    if (typeof value === 'string') {
      set(obj, keyPath, Number(value));
    }
  });

  return obj;
};
