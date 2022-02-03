export function promisify(fn, ...args) {
  return new Promise((resolve, reject) => {
    fn.apply(null, [...args, resolve, reject]);
  });
}
