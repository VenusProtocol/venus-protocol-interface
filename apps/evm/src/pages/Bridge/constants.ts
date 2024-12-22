import { featureFlags } from 'hooks/useIsFeatureEnabled';
import { chains } from 'libs/wallet';

export const bridgeChains = chains.filter(chain => featureFlags.bridgeRoute.includes(chain.id));
