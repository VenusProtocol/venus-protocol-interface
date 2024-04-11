import ClaimRewardButton from 'containers/Layout/ClaimRewardButton';
import ConnectButton from 'containers/Layout/ConnectButton';
import { ChainSelect } from '../ChainSelect';

export const MdUpControls: React.FC = () => (
  <div className="hidden md:flex md:h-12 md:items-center md:space-x-4 md:pl-6">
    <ClaimRewardButton className="flex-none md:whitespace-nowrap" />

    <ChainSelect />

    <ConnectButton className="flex-none" />
  </div>
);
