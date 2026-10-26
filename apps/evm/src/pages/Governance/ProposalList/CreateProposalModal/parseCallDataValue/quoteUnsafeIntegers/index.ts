const NUMBER_LITERAL_REGEX = /^-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(?=$|[\s,\]}])/;
const MAX_SAFE_INTEGER = BigInt(Number.MAX_SAFE_INTEGER);

const isSafeInteger = (literal: string) => {
  if (!/^-?\d+$/.test(literal)) {
    return false;
  }

  const parsedLiteral = BigInt(literal);
  return parsedLiteral <= MAX_SAFE_INTEGER && parsedLiteral >= -MAX_SAFE_INTEGER;
};

// Digits inside a bare address are not a value, so only read them where one can start
const startsValue = (value: string, index: number) => {
  for (let position = index - 1; position >= 0; position -= 1) {
    const character = value[position];

    if (character === ' ' || character === '\n' || character === '\t' || character === '\r') {
      continue;
    }

    return character === '[' || character === '{' || character === ',' || character === ':';
  }

  return true;
};

// Quoted so JSON.parse cannot round them, leaving the encoder to reject non-integers
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

    const [numberLiteral] = startsValue(value, index)
      ? NUMBER_LITERAL_REGEX.exec(value.slice(index)) ?? []
      : [];

    if (numberLiteral) {
      output += isSafeInteger(numberLiteral) ? numberLiteral : `"${numberLiteral}"`;
      index += numberLiteral.length;
      continue;
    }

    output += character;
    index += 1;
  }

  return output;
};
