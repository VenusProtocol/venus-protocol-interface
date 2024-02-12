import { Icon, IconName } from 'components';

export interface IconLinkProps {
  iconName: IconName;
  href?: string;
}

export const IconLink: React.FC<IconLinkProps> = ({ href, iconName }) => (
  <a
    className="ml-4 flex h-6 w-6 items-center justify-center rounded bg-lightGrey transition-colors first-of-type:ml-0 hover:bg-blue active:bg-darkBlue"
    href={href}
    target="_blank"
    rel="noreferrer"
  >
    <Icon name={iconName} className="h-3 w-3 text-offWhite" />
  </a>
);
