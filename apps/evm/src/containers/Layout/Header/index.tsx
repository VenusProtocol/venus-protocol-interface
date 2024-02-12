import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';

import { Breadcrumbs } from '../Breadcrumbs';
import { ChainSelect } from '../ChainSelect';
import ClaimRewardButton from '../ClaimRewardButton';
import ConnectButton from '../ConnectButton';

export const Header: React.FC = () => {
  const isChainSelectEnabled = useIsFeatureEnabled({ name: 'chainSelect' });
  return (
    <div className="px-4 pb-4 pt-6 md:flex md:justify-between md:px-6 md:py-8 xl:px-10">
      <div className="flex flex-1 items-center">
        <Breadcrumbs />
      </div>

      <div className="hidden md:flex md:h-12 md:items-center md:space-x-4 md:pl-6">
        <ClaimRewardButton className="flex-none md:whitespace-nowrap" />

        {isChainSelectEnabled && <ChainSelect />}

        <ConnectButton className="flex-none" />
      </div>
    </div>
  );
};
