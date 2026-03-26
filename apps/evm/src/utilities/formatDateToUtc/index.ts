export const formatDateToUtc = (value: Date | number | undefined) => {
  if (typeof value === 'undefined') return undefined;

  const valueDate = typeof value === 'number' ? new Date(value) : value;

  return !Number.isNaN(valueDate?.getTime())
    ? new Date(valueDate.getTime() + valueDate.getTimezoneOffset() * 60000)
    : undefined;
};
