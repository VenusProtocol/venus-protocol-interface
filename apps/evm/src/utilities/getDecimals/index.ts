export const getDecimals = ({ value }: { value: number | string }) =>
  String(value).includes('.') ? String(value).split('.')[1].length : 0;
