/**
 * Takes an index function and an array and returns an object with indexFn(item)
 * as keys and array items as values.
 *
 * @param {object => string} indexFn
 * @param {array} arr
 * @returns An object with the keys derived as indexFn(array item)
 */

const indexBy = <V>(indexFn: (v: V, index: number) => string, arr: V[]) =>
  arr.reduce((result: Record<string, V>, item: V, index) => {
    result[indexFn(item, index)] = item;
    return result;
  }, {});

export default indexBy;
