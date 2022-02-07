export function promisify(fn: $TSFixMe, ...args: $TSFixMe[]) {
  return new Promise((resolve, reject) => {
    fn.apply(null, [...args, resolve, reject]);
  });
}
