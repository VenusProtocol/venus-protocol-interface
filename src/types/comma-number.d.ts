// PR to add type Definitely Typed `https://github.com/DefinitelyTyped/DefinitelyTyped/pull/58653
declare module 'comma-number' {

  declare function commaNumber(
    inputNumber: number | string,
    optionalSeparator?: string,
    optionalDecimalChar?: string,
  ): string;

  declare namespace commaNumber {
    function bindWith(separator: string, decimalChar: string): (num: number | string) => string;
  }

  export = commaNumber;
}
