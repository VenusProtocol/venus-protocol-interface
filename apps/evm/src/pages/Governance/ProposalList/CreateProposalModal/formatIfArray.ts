/**
 *
 * @param value string
 * Check if the string starts and ends with brackets to format array
 */
export const formatIfArray = (value: string | number): string | number | string[] => {
  const val = value.toString();
  if (val?.slice(0, 1) === '[' && val.slice(val.length - 1, val.length) === ']') {
    try {
      return JSON.parse(val);
    } catch (err) {
      return value;
    }
  }
  return value;
};

export default formatIfArray;
