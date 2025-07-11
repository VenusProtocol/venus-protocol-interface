import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useChainId } from 'libs/wallet';
import { generateExplorerUrl } from 'utilities';

import { Link } from 'containers/Link';
import { IconLink } from './IconLink';
import {
  VENUS_DISCORD_URL,
  VENUS_DOC_URL,
  VENUS_GITHUB_URL,
  VENUS_TELEGRAM_URL,
  VENUS_X_URL,
} from './constants';

export const Footer: React.FC = () => {
  const { chainId } = useChainId();
  const { t } = useTranslation();

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  return (
    <footer className="bg-background p-4 sm:flex sm:h-14 sm:flex-none sm:items-center sm:justify-end sm:space-x-6 md:px-6 xl:px-10">
      <Link className="text-offWhite mb-4 block text-sm underline sm:mb-0" href={VENUS_DOC_URL}>
        {t('footer.links.documentation')}
      </Link>

      <div className="bg-lightGrey hidden h-full w-[1px] sm:block" />

      <div className="flex flex-none items-center">
        <IconLink
          href={
            xvs &&
            generateExplorerUrl({
              hash: xvs.address,
              urlType: 'token',
              chainId,
            })
          }
          iconName="venus"
        />
        <IconLink iconName="discord" href={VENUS_DISCORD_URL} />
        <IconLink iconName="telegram" href={VENUS_TELEGRAM_URL} />
        <IconLink iconName="x" href={VENUS_X_URL} />
        <IconLink iconName="github" href={VENUS_GITHUB_URL} />
      </div>
    </footer>
  );
};
