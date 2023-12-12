import { useGetBlockNumber } from 'clients/api';
import { Link } from 'containers/Link';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useGetToken } from 'packages/tokens';
import { useTranslation } from 'packages/translations';
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
  const { data: getBlockNumberData } = useGetBlockNumber();

  const { t } = useTranslation();
  const currentBlockNumber = getBlockNumberData?.blockNumber;
  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const { explorerUrl } = useGetChainMetadata();

  return (
    <footer className="flex h-14 flex-none items-center justify-between bg-background px-4 sm:justify-end md:px-6 xl:px-10">
      {!!currentBlockNumber && (
        <Link
          className="text-sm text-grey hover:no-underline sm:mr-6"
          href={explorerUrl}
          target="_blank"
          rel="noreferrer"
        >
          {t('footer.latestNumber')}
          <br className="sm:hidden" /> <span className="text-offWhite">{currentBlockNumber}</span>
        </Link>
      )}

      <div className="flex">
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
      </div>
    </footer>
  );
};
