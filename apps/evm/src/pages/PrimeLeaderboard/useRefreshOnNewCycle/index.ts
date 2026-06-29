import { useEffect, useRef } from 'react';

import { useGetPrimeCurrentCycle } from 'clients/api';
import { queryClient } from 'clients/api/queryClient';
import FunctionKey from 'constants/functionKey';

const REFRESHED_FUNCTION_KEYS = [
  FunctionKey.GET_PRIME_USER_PENDING_REWARDS,
  FunctionKey.GET_PRIME_EFFECTIVE_STAKE,
  FunctionKey.GET_PRIME_MINIMUM_STAKE,
  FunctionKey.GET_PRIME_DEPOSITS,
  FunctionKey.GET_PRIME_LEADERBOARD,
  FunctionKey.GET_IS_USER_PRIME_V2,
];

export const useRefreshOnNewCycle = () => {
  const { data: currentCycle } = useGetPrimeCurrentCycle();
  const cycleIndex = currentCycle?.cycle?.cycleIndex;
  const previousCycleIndexRef = useRef(cycleIndex);

  useEffect(() => {
    if (cycleIndex === undefined) {
      return;
    }

    if (
      previousCycleIndexRef.current !== undefined &&
      cycleIndex !== previousCycleIndexRef.current
    ) {
      REFRESHED_FUNCTION_KEYS.forEach(key => queryClient.invalidateQueries({ queryKey: [key] }));
    }

    previousCycleIndexRef.current = cycleIndex;
  }, [cycleIndex]);
};
