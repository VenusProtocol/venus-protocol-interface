const getArgs = (func: $TSFixMe) => {
  // First match everything inside the function argument parens.
  const args = func.toString().match(/.*?\(([^)]*)\)/)
    ? func.toString().match(/.*?\(([^)]*)\)/)[1]
    : '';
  // Split the arguments string into an array comma delimited.
  return args
    .split(',')

    .map((arg: $TSFixMe) =>
      // Ensure no inline comments are parsed and trim the whitespace.
      arg.replace(/\/\*.*\*\//, '').trim(),
    )

    .filter(
      (arg: $TSFixMe) =>
        // Ensure no undefined values are added.
        arg,
    );
};

export default getArgs;
