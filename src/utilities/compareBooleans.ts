const compareBooleans = (
  valueA: boolean,
  valueB: boolean,
  direction: 'asc' | 'desc',
): -1 | 0 | 1 => {
  if (valueA === true && valueB === false) {
    return direction === 'asc' ? 1 : -1;
  }

  if (valueA === false && valueB === true) {
    return direction === 'asc' ? -1 : 1;
  }

  return 0;
};

export default compareBooleans;
