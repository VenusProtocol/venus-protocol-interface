import cn from 'classnames';
import s from './SocialLinks.module.css';
import IconDiscord from './assets/discord.svg?react';
import IconGithub from './assets/github.svg?react';
import IconTelegram from './assets/telegram.svg?react';
import IconTwitter from './assets/twitter.svg?react';

interface ISocialLinksProps {
  className?: string;
}

const socialLinks = [
  {
    icon: <IconTelegram className={s.socialIcon} />,
    href: 'https://t.me/venusprotocol',
  },
  {
    icon: <IconDiscord className={s.socialIcon} />,
    href: 'https://discord.gg/venus-protocol-912811548651708448',
  },
  {
    icon: <IconTwitter className={s.socialIcon} />,
    href: 'https://twitter.com/VenusProtocol',
  },
  {
    icon: <IconGithub className={s.socialIcon} />,
    href: 'https://github.com/VenusProtocol/',
  },
];

const SocialLinks: React.FC<ISocialLinksProps> = ({ className }) => (
  <div className={cn(className, s.socialLinksWrapper)}>
    <div className={s.mappedLinks}>
      {socialLinks.map(({ icon, href }) => (
        <a target="_blank" rel="noreferrer" key={href} className={s.socialLink} href={href}>
          {icon}
        </a>
      ))}
    </div>
  </div>
);

export default SocialLinks;
