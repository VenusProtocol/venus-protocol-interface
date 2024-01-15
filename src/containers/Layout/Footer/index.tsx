import { useGetToken } from 'packages/tokens';
import { useChainId } from 'packages/wallet';
import { generateChainExplorerUrl } from 'utilities';

import { IconLink } from './IconLink';
import {
  VENUS_DISCORD_URL,
  VENUS_GITHUB_URL,
  VENUS_MEDIUM_URL,
  VENUS_TELEGRAM_URL,
  VENUS_TWITTER_URL,
} from './constants';

export const Footer: React.FC = () => {
  const { chainId } = useChainId();

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  return (
    <footer className="flex h-14 flex-none items-center justify-between bg-background px-4 sm:justify-end md:px-6 xl:px-10">
      <IconLink
        href={
          xvs &&
          generateChainExplorerUrl({
            hash: xvs.address,
            urlType: 'token',
            chainId,
          })
        }
        iconName="venus"
      />
      <IconLink iconName="discord" href={VENUS_DISCORD_URL} />
      <IconLink iconName="telegram" href={VENUS_TELEGRAM_URL} />
      <IconLink iconName="twitter" href={VENUS_TWITTER_URL} />
      <IconLink iconName="medium" href={VENUS_MEDIUM_URL} />
      <IconLink iconName="github" href={VENUS_GITHUB_URL} />
    </footer>
  );
};
