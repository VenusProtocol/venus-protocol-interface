const compareStrings = (
  valueA: string | undefined,
  valueB: string | undefined,
  direction: 'asc' | 'desc',
): number => {
  if (valueA === undefined || valueB === undefined) {
    return 0;
  }

  return direction === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
};

export default compareStrings;
