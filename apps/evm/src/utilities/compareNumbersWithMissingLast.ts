import compareNumbers from 'utilities/compareNumbers';

const compareNumbersWithMissingLast = (
  valueA: number | undefined,
  valueB: number | undefined,
  direction: 'asc' | 'desc',
): number => {
  const isValueAMissing = !Number.isFinite(valueA);
  const isValueBMissing = !Number.isFinite(valueB);

  if (isValueAMissing && isValueBMissing) {
    return 0;
  }

  if (isValueAMissing) {
    return 1;
  }

  if (isValueBMissing) {
    return -1;
  }

  return compareNumbers(valueA, valueB, direction);
};

export default compareNumbersWithMissingLast;
