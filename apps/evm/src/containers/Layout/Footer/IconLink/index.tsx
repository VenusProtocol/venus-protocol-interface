import { Icon, IconName } from 'components';

export interface IconLinkProps {
  iconName: IconName;
  href?: string;
}

export const IconLink: React.FC<IconLinkProps> = ({ href, iconName }) => (
  <a
    className="bg-lightGrey hover:bg-blue active:bg-darkBlue ml-4 flex h-6 w-6 items-center justify-center rounded transition-colors first-of-type:ml-0"
    href={href}
    target="_blank"
    rel="noreferrer"
  >
    <Icon name={iconName} className="text-offWhite h-3 w-3" />
  </a>
);
