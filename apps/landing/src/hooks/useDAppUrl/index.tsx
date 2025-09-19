import { DAPP_URL } from 'constants/production';
import { useAppStateContext } from 'context';

export const useDAppUrl = () => {
  const { analyticIds } = useAppStateContext();

  // Pass session and distinct IDs to the app URL, so that we can follow users across Venus apps
  let dAppUrl = `${DAPP_URL}`;

  if (analyticIds) {
    dAppUrl += `/#/?sessionId=${analyticIds?.sessionId}&distinctId=${analyticIds?.distinctId}`;
  }

  return { dAppUrl };
};
