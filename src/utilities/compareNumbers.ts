const compareNumbers = (
  valueA: number | undefined,
  valueB: number | undefined,
  direction: 'asc' | 'desc',
): -1 | 0 | 1 => {
  if (!valueA || !valueB) {
    return 0;
  }

  if (valueA < valueB) {
    return direction === 'asc' ? -1 : 1;
  }

  if (valueA > valueB) {
    return direction === 'asc' ? 1 : -1;
  }

  return 0;
};

export default compareNumbers;
