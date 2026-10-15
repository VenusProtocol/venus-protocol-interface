const INTEGER_LITERAL_REGEX = /^-?\d+(?![\d.eE])/;
const MAX_SAFE_INTEGER = BigInt(Number.MAX_SAFE_INTEGER);

const isSafeInteger = (literal: string) => {
  const parsedLiteral = BigInt(literal);
  return parsedLiteral <= MAX_SAFE_INTEGER && parsedLiteral >= -MAX_SAFE_INTEGER;
};

// JSON.parse turns every number into a float, so integers wider than 2^53 come
// back rounded. Quoting them before parsing keeps their digits intact.
export const quoteUnsafeIntegers = (value: string) => {
  let output = '';
  let index = 0;
  let isInsideString = false;

  while (index < value.length) {
    const character = value[index];

    if (isInsideString) {
      output += character;

      if (character === '\\') {
        output += value[index + 1] ?? '';
        index += 2;
        continue;
      }

      if (character === '"') {
        isInsideString = false;
      }

      index += 1;
      continue;
    }

    if (character === '"') {
      isInsideString = true;
      output += character;
      index += 1;
      continue;
    }

    const [integerLiteral] = INTEGER_LITERAL_REGEX.exec(value.slice(index)) ?? [];

    if (integerLiteral) {
      output += isSafeInteger(integerLiteral) ? integerLiteral : `"${integerLiteral}"`;
      index += integerLiteral.length;
      continue;
    }

    output += character;
    index += 1;
  }

  return output;
};
