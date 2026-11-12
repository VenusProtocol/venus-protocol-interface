import { useTranslation } from 'libs/translations';

import { Icon, type IconName, cn } from 'components';
import {
  VENUS_COMMUNITY_URL,
  VENUS_DOC_URL,
  VENUS_GITHUB_URL,
  VENUS_TELEGRAM_URL,
  VENUS_X_URL,
} from 'constants/production';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { forwardRef } from 'react';
import { matchPath, useLocation } from 'react-router';

interface SocialLink {
  iconName: IconName;
  href?: string;
}

interface LinkConfig {
  label: string;
  href?: string;
  to?: string;
}

export const Footer = forwardRef<HTMLDivElement>((_, ref) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const isDashboard = !!matchPath(routes.dashboard.path, pathname);

  const socialLinks: SocialLink[] = [
    {
      iconName: 'venus',
      href: VENUS_COMMUNITY_URL,
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

  const footerLinkGroups: LinkConfig[][] = [
    [
      {
        label: t('footer.links.documentation'),
        href: VENUS_DOC_URL,
      },
      {
        label: t('footer.links.skills'),
        to: routes.skills.path,
      },
    ],
    [
      {
        label: t('footer.links.privacyPolicy'),
        to: routes.privacyPolicy.path,
      },
      {
        label: t('footer.links.termsOfUse'),
        to: routes.termsOfUse.path,
      },
    ],
  ];

  return (
    <footer
      ref={ref}
      className={cn(
        'mt-10 flex flex-col items-center gap-4 px-5 pt-2 pb-5 md:flex-row md:flex-wrap md:justify-between md:p-5 md:px-6 xl:px-10',
        isDashboard && 'mt-0 pt-12 md:pt-12',
      )}
    >
      <nav className="flex flex-col items-center gap-4 md:flex-row md:flex-wrap">
        {footerLinkGroups.map(footerLinks => (
          <div className="flex items-center justify-center gap-4" key={footerLinks[0].label}>
            {footerLinks.map(footerLink => {
              const { label, ...restProps } = footerLink;

              return (
                <Link className="text-secondary text-sm" key={label} {...restProps}>
                  {label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="flex flex-none items-center justify-center">
        {socialLinks.map(socialLink => (
          <a
            className="bg-neutral hover:bg-brand focus-visible:bg-brand active:bg-brand-pressed ml-4 flex h-6 w-6 items-center justify-center rounded-sm transition-colors first-of-type:ml-0"
            href={socialLink.href}
            key={socialLink.href}
            target="_blank"
            rel="noreferrer"
          >
            <Icon name={socialLink.iconName} className="text-primary h-3 w-3" />
          </a>
        ))}
      </div>
    </footer>
  );
});
