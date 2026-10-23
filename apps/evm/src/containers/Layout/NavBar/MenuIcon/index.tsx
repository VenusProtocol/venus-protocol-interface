import { CoreIcon } from './CoreIcon';
import { LiquidityHubIcon } from './LiquidityHubIcon';
import { SpokeIcon } from './SpokeIcon';
import { VaultIcon } from './VaultIcon';

export type MenuIconName = 'core' | 'liquidityHub' | 'vault' | 'spoke';

const icons: Record<MenuIconName, React.FC<React.SVGProps<SVGSVGElement>>> = {
  core: CoreIcon,
  liquidityHub: LiquidityHubIcon,
  vault: VaultIcon,
  spoke: SpokeIcon,
};

export interface MenuIconProps extends React.SVGProps<SVGSVGElement> {
  name: MenuIconName;
}

export const MenuIcon: React.FC<MenuIconProps> = ({ name, ...otherProps }) => {
  const Component = icons[name];

  return <Component {...otherProps} />;
};
