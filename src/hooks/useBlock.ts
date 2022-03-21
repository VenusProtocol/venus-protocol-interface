import { useEffect, useState } from 'react';

import { useWeb3 } from 'clients/web3';
import useRefresh from './useRefresh';

export const useBlock = () => {
  const [blockNumber, setBlockNumber] = useState(0);
  const { fastRefresh } = useRefresh();
  const web3 = useWeb3();

  useEffect(() => {
    const getBlockNumber = async () => {
      const bn = await web3.eth.getBlockNumber();
      setBlockNumber(bn);
    };
    getBlockNumber();
  }, [fastRefresh, web3]);

  return blockNumber;
};
