import { useCallback } from 'react';
import useWeb3 from './useWeb3';

export default () => {
  const web3 = useWeb3();

  const callFunc = useCallback(
    async calls => {
      const batch = new web3.BatchRequest();
      const promises = calls.map(call => {
        return new Promise((res, rej) => {
          const req = call.request((err, data) => {
            if (err) {
              rej(err);
            } else {
              res(data);
            }
          });
          batch.add(req);
        });
      });
      batch.execute();
      return Promise.all(promises);
    },
    [web3]
  );

  return callFunc;
};
