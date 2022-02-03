// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export function promisify(fn: $TSFixMe, ...args: $TSFixMe[]) {
  return new Promise((resolve, reject) => {
    fn.apply(null, [...args, resolve, reject]);
  });
}
