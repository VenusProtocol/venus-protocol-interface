import { cn } from '@venusprotocol/ui';
import { Icon } from 'components';
import { useSunsetModalStore } from '../sunsetModalStore';

export { SunsetModal } from './SunsetModal';

export interface SunsetIndicatorProps {
  interactive?: boolean;
  className?: string;
}

export const SunsetIndicator: React.FC<SunsetIndicatorProps> = ({
  interactive = true,
  className,
}) => {
  const open = useSunsetModalStore(state => state.open);

  const handleClick = (e: React.MouseEvent) => {
    if (!interactive) return;
    e.preventDefault();
    e.stopPropagation();
    open();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return;
    e.stopPropagation();
  };

  return (
    <span
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      className={cn(
        'flex flex-none items-center justify-center',
        interactive && 'cursor-pointer',
        className,
      )}
    >
      <Icon name="sunset" className="size-5 text-orange" />
    </span>
  );
};
