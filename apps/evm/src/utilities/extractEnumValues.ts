export function extractEnumValues<T extends { [key: string]: string | number }>(
  enumObject: T,
): T[keyof T][] {
  return Object.values(enumObject).filter((value): value is T[keyof T] => !Number.isNaN(+value));
}
