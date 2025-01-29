import {
  Arrow,
  Provider,
  type TooltipContentProps,
  Tooltip as TooltipPrimitive,
  type TooltipProps as TooltipPrimitiveProps,
  Trigger,
} from '@radix-ui/react-tooltip';
import { Modal } from 'components/Modal';
import { useBreakpointUp } from 'hooks/responsive';
import { useState } from 'react';
import { cn } from 'utilities';
import { TooltipContent } from './TooltipContent';

export interface TooltipProps extends TooltipPrimitiveProps {
  className?: string;
  content: string | React.ReactElement;
  side?: TooltipContentProps['side'];
}

export const Tooltip = ({
  className,
  content,
  children,
  delayDuration = 200,
  side,
  ...props
}: TooltipProps) => {
  const [isTooltipOpened, setIsTooltipOpened] = useState(false);
  const isMdOrUp = useBreakpointUp('md');

  const handleToggleDropdown = () => setIsTooltipOpened(!isTooltipOpened);

  return (
    <Provider>
      <TooltipPrimitive delayDuration={delayDuration} {...props}>
        <Trigger asChild>
          <div
            className={className}
            onClick={e => {
              if (!isMdOrUp) {
                setIsTooltipOpened(true);
              }
              e.preventDefault();
            }}
          >
            {children}
          </div>
        </Trigger>
        <TooltipContent
          onPointerDownOutside={e => e.preventDefault()}
          side={side}
          className={cn('block p-3', !isMdOrUp && 'hidden')}
        >
          {content}
          <Arrow className="fill-lightGrey w-[14px] h-[7px]" />
        </TooltipContent>
      </TooltipPrimitive>

      <Modal
        buttonClassName="right-3"
        onClick={e => e.stopPropagation()}
        isOpen={isTooltipOpened && !isMdOrUp}
        handleClose={handleToggleDropdown}
      >
        <div className="pt-3">{content}</div>
      </Modal>
    </Provider>
  );
};
