export const hashSeed = (index: number, salt: number) => {
  let value = Math.imul(index + salt * 1013, 0x9e3779b1);
  value ^= value >>> 16;
  value = Math.imul(value, 0x85ebca6b);
  value ^= value >>> 13;
  return (value >>> 0) / 0x100000000;
};
