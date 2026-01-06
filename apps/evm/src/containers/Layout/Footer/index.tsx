import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useChainId } from 'libs/wallet';
import { generateExplorerUrl } from 'utilities';

import { Icon, type IconName } from 'components';
import { Link } from 'containers/Link';
import { forwardRef } from 'react';
import {
  VENUS_DISCORD_URL,
  VENUS_DOC_URL,
  VENUS_GITHUB_URL,
  VENUS_PRIVACY_POLICY_URL,
  VENUS_TELEGRAM_URL,
  VENUS_TERMS_OF_USE_URL,
  VENUS_X_URL,
} from './constants';

interface SocialLink {
  iconName: IconName;
  href?: string;
}

interface RefLink {
  label: string;
  href: string;
}

export const Footer = forwardRef<HTMLDivElement>((_, ref) => {
  const { chainId } = useChainId();
  const { t } = useTranslation();

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const socialLinks: SocialLink[] = [
    {
      iconName: 'venus',
      href:
        xvs &&
        generateExplorerUrl({
          hash: xvs.address,
          urlType: 'token',
          chainId,
        }),
    },
    {
      iconName: 'discord',
      href: VENUS_DISCORD_URL,
    },
    {
      iconName: 'telegram',
      href: VENUS_TELEGRAM_URL,
    },
    {
      iconName: 'x',
      href: VENUS_X_URL,
    },
    {
      iconName: 'github',
      href: VENUS_GITHUB_URL,
    },
  ];

  const refLinks: RefLink[] = [
    {
      label: t('footer.links.documentation'),
      href: VENUS_DOC_URL,
    },
    {
      label: t('footer.links.privacyPolicy'),
      href: VENUS_PRIVACY_POLICY_URL,
    },
    {
      label: t('footer.links.termsOfUse'),
      href: VENUS_TERMS_OF_USE_URL,
    },
  ];

  return (
    <footer
      ref={ref}
      className="bg-background p-4 space-y-4 sm:flex sm:justify-between sm:items-center sm:space-y-0 md:px-6 xl:px-10"
    >
      <div className="flex items-center gap-x-4">
        {refLinks.map(refLink => (
          <Link className="text-grey text-sm" href={refLink.href} key={refLink.href}>
            {refLink.label}
          </Link>
        ))}
      </div>

      <div className="flex flex-none items-center">
        {socialLinks.map(socialLink => (
          <a
            className="bg-lightGrey hover:bg-blue active:bg-darkBlue ml-4 flex h-6 w-6 items-center justify-center rounded-sm transition-colors first-of-type:ml-0"
            href={socialLink.href}
            key={socialLink.href}
            target="_blank"
            rel="noreferrer"
          >
            <Icon name={socialLink.iconName} className="text-white h-3 w-3" />
          </a>
        ))}
      </div>
    </footer>
  );
});
