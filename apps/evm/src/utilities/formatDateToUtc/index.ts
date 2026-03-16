import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { type FormatOptions, format } from 'date-fns';

const DEFAULT_FORMAT_STR = 'MM/dd/yyyy';

type Opts = {
  showPlaceholder?: boolean;
  formatStr?: string;
  formatOptions?: FormatOptions;
};

export const formatDateToUtc = (value: Date | number | undefined, opts?: Opts) => {
  const { showPlaceholder = false, formatStr = DEFAULT_FORMAT_STR, formatOptions } = opts ?? {};

  if (typeof value === 'undefined') return showPlaceholder ? PLACEHOLDER_KEY : undefined;

  const valueDate = typeof value === 'number' ? new Date(value) : value;

  const utcDate = !Number.isNaN(valueDate?.getTime())
    ? new Date(valueDate.getTime() + valueDate.getTimezoneOffset() * 60000)
    : undefined;

  if (!utcDate) return showPlaceholder ? PLACEHOLDER_KEY : undefined;

  return format(utcDate, formatStr ?? DEFAULT_FORMAT_STR, formatOptions);
};
