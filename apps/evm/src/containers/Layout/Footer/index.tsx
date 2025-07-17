import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useChainId } from 'libs/wallet';
import { generateExplorerUrl } from 'utilities';

import { Link } from 'containers/Link';
import { forwardRef } from 'react';
import { IconLink } from './IconLink';
import {
  VENUS_DISCORD_URL,
  VENUS_DOC_URL,
  VENUS_GITHUB_URL,
  VENUS_TELEGRAM_URL,
  VENUS_X_URL,
} from './constants';

export const Footer = forwardRef<HTMLDivElement>((_, ref) => {
  const { chainId } = useChainId();
  const { t } = useTranslation();

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  return (
    <footer
      ref={ref}
      className="bg-background p-4 flex sm:h-14 sm:flex-none sm:items-center sm:justify-end sm:space-x-6 md:px-6 xl:px-10"
    >
      <Link className="text-offWhite block text-sm underline" href={VENUS_DOC_URL}>
        {t('footer.links.documentation')}
      </Link>

      <div className="bg-lightGrey mx-6 h-full w-[1px] block" />

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
});
