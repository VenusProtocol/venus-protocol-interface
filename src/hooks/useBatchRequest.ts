import { useCallback } from 'react';
import { useWeb3 } from 'clients/web3';

export default () => {
  const web3 = useWeb3();

  const callFunc = useCallback(
    async calls => {
      const batch = new web3.BatchRequest();

      const promises = calls.map(
        (call: $TSFixMe) =>
          new Promise((res, rej) => {
            const req = call.request((err: $TSFixMe, data: $TSFixMe) => {
              if (err) {
                rej(err);
              } else {
                res(data);
              }
            });
            batch.add(req);
          }),
      );
      batch.execute();
      return Promise.all(promises);
    },
    [web3],
  );

  return callFunc;
};
