import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useChainId } from 'libs/wallet';

import { generateChainExplorerUrl } from 'utilities';

import { Link } from '../../Link';
import { IconLink } from './IconLink';
import {
  VENUS_DISCORD_URL,
  VENUS_DOC_URL,
  VENUS_GITHUB_URL,
  VENUS_MEDIUM_URL,
  VENUS_TELEGRAM_URL,
  VENUS_TWITTER_URL,
} from './constants';

export const Footer: React.FC = () => {
  const { chainId } = useChainId();
  const { t } = useTranslation();

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  return (
    <footer className="bg-background p-4 sm:flex sm:h-14 sm:flex-none sm:items-center sm:justify-end sm:space-x-6 md:px-6 xl:px-10">
      <Link className="mb-4 block text-sm text-offWhite underline sm:mb-0" href={VENUS_DOC_URL}>
        {t('footer.links.documentation')}
      </Link>

      <div className="hidden h-full w-[1px] bg-lightGrey sm:block" />

      <div className="flex flex-none items-center">
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
