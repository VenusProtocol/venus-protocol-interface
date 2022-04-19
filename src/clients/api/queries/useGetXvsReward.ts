import { useContext } from 'react';
import { useQuery, QueryObserverOptions } from 'react-query';
import BigNumber from 'bignumber.js';

import { useComptrollerContract } from 'clients/contracts/hooks';
import { useWeb3 } from 'clients/web3';
import { AuthContext } from 'context/AuthContext';
import useGetVenusInitialIndex from 'clients/api/queries/useGetVenusInitialIndex';
import useGetVenusAccrued from 'clients/api/queries/useGetVenusAccrued';
import useGetVenusVaiState from 'clients/api/queries/useGetVenusVaiState';
import useGetMintedVai from 'clients/api/queries/useGetMintedVai';
import useGetVenusVaiMinterIndex from 'clients/api/queries/useGetVenusVaiMinterIndex';
import FunctionKey from 'constants/functionKey';
import getXvsReward, { GetXvsRewardOutput } from './getXvsReward';

type Options = QueryObserverOptions<
  GetXvsRewardOutput,
  Error,
  GetXvsRewardOutput,
  GetXvsRewardOutput,
  FunctionKey.GET_XVS_REWARD
>;

const useGetXvsReward = (accountAddress: string, options?: Options) => {
  const web3 = useWeb3();

  const { account } = useContext(AuthContext);
  const comptrollerContract = useComptrollerContract();

  const { data: venusInitialIndex } = useGetVenusInitialIndex();
  const { data: xvsAccrued } = useGetVenusAccrued(accountAddress);
  const { data: vaiState } = useGetVenusVaiState();
  const { data: userMintedVai } = useGetMintedVai(accountAddress);
  const { data: vaiMinterIndex } = useGetVenusVaiMinterIndex(accountAddress);

  return useQuery(
    FunctionKey.GET_XVS_REWARD,
    () =>
      getXvsReward({
        web3,
        accountAddress: account?.address || '',
        comptrollerContract,
        venusInitialIndex: venusInitialIndex || 0,
        xvsAccrued: xvsAccrued || new BigNumber(0),
        vaiMintIndex: vaiState?.index ? +vaiState.index : 0,
        userVaiMintIndex: vaiMinterIndex || 0,
        userMintedVai: userMintedVai || new BigNumber(0),
      }),
    {
      enabled:
        (options?.enabled === undefined || options?.enabled) &&
        !!account?.address &&
        venusInitialIndex !== undefined &&
        !!xvsAccrued &&
        vaiState?.index !== undefined &&
        vaiMinterIndex !== undefined &&
        !!userMintedVai,
    },
  );
};

export default useGetXvsReward;
